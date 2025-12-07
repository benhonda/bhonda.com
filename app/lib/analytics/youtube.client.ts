import { browserTrackEvent } from "./events.defaults.client";
import { logDebug } from "~/lib/logger";

export default class YouTubeAnalytics {
  private settings: {
    track: (
      | "Video Content Started"
      | "Video Content Completed"
      | "Video Playback Started"
      | "Video Playback Seek Started"
      | "Video Playback Seek Completed"
      | "Video Playback Buffer Started"
      | "Video Playback Buffer Completed"
      | "Video Playback Paused"
      | "Video Playback Resumed"
      | "Video Playback Completed"
      | "Video Progress Reached"
    )[];
  } = {
    track: [
      "Video Content Started",
      "Video Content Completed",
      // "Video Playback Started",
      // "Video Playback Seek Started",
      "Video Playback Seek Completed",
      // "Video Playback Buffer Started",
      // "Video Playback Buffer Completed",
      // "Video Playback Paused",
      // "Video Playback Resumed",
      "Video Playback Completed",
      "Video Progress Reached",
    ],
  };
  private player: YT.Player;
  private apiKey: string;
  private playbackStarted: boolean = false;
  private contentStarted: boolean = false;
  private isPaused: boolean = false;
  private isBuffering: boolean = false;
  private isSeeking: boolean = false;
  private playedSeconds: number[] = [0];
  private metadata: {
    playback: {
      video_player: string;
      position?: number;
      quality?: string | "unknown"; // Adjust type based on actual YT API return values
      sound?: number;
      total_length?: number;
    };
    content: {
      position?: number;
      title?: string;
      description?: string;
      keywords?: string[];
      channel?: string;
      airdate?: string; // ISO 8601 date string
    };
  }[] = []; // Initialize as empty array
  private playlistIndex: number = 0;
  private lastReachedIntervalPercentage: number = 0;

  /**
   * Creates a YouTube video plugin to track events directly from the player.
   *
   * @param player YouTube IFrame Player (docs: https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player).
   * @param apiKey Youtube Data API key (docs: https://developers.google.com/youtube/registering_an_application).
   */
  constructor(player: YT.Player, apiKey: string) {
    this.player = player;
    this.apiKey = apiKey;
    this.playedSeconds = [0];
    // Initialize with a default structure in case API call fails early
    this.metadata = [{ playback: { video_player: "youtube" }, content: {} }];
  }

  public initialize(): void {
    // Youtube API requires listeners to exist as top-level props on window object
    const onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.player.addEventListener("onStateChange", onPlayerStateChange);

    this.onPlayerReady();
  }

  private onPlayerReady(): void {
    // this fires when the player html element loads
    logDebug("Player ready, retrieving metadata...");
    this.retrieveMetadata().catch((err) => {
      console.error("Error retrieving metadata on player ready:", err);
      // Keep the default metadata initialized in the constructor
    });
  }

  // yt reports events via state changes in the player rather than explicitly EVENTS like 'play', 'pause', etc
  public onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    switch (event.data) {
      case YT.PlayerState.BUFFERING:
        this.handleBuffer();
        break;

      case YT.PlayerState.PLAYING:
        this.handlePlay();
        break;

      case YT.PlayerState.PAUSED:
        this.handlePause();
        break;

      case YT.PlayerState.ENDED:
        this.handleEnd();
        break;
    }
  }

  /**
   * This gets called every 1s
   *
   * NOTE: the type of this was supposed to by OnProgressProps, but it was not working, so I changed it to the following:
   */
  public onPlayerProgress({ playedSeconds }: { playedSeconds: number }): void {
    const newPlayedSeconds = [...this.playedSeconds, playedSeconds];
    this.playedSeconds = newPlayedSeconds;

    const totalLength = this.metadata[this.playlistIndex].playback.total_length;
    if (!totalLength) {
      console.warn("No total length found for metadata");
      return;
    }

    // each entry in this.playedSeconds is about a second, so calculate how much each is worth in percentage
    const percentagePerSecond = 100.0 / totalLength;
    const watchedPercentage = newPlayedSeconds.length * percentagePerSecond;

    let watchedPercentageInterval: number | null = null;

    if (watchedPercentage >= 90) {
      watchedPercentageInterval = 90;
    } else if (watchedPercentage >= 70) {
      watchedPercentageInterval = 70;
    } else if (watchedPercentage >= 50) {
      watchedPercentageInterval = 50;
    } else if (watchedPercentage >= 30) {
      watchedPercentageInterval = 30;
    } else if (watchedPercentage >= 20) {
      watchedPercentageInterval = 20;
    } else if (watchedPercentage >= 10) {
      watchedPercentageInterval = 10;
    } else if (watchedPercentage >= 5) {
      watchedPercentageInterval = 5;
    }

    if (watchedPercentageInterval && this.lastReachedIntervalPercentage < watchedPercentageInterval) {
      const currentMetadata = this.metadata[this.playlistIndex];
      this.track("Video Progress Reached", {
        ...currentMetadata.playback,
        watched_percentage: watchedPercentageInterval,
      });
      this.lastReachedIntervalPercentage = watchedPercentageInterval;
    }
  }

  /**
   * Retrieves the video metadata from Youtube Data API using user's API Key
   * docs: https://developers.google.com/youtube/v3/docs/videos/list
   *
   * @returns A promise that resolves when metadata is fetched or rejects on error.
   */
  private retrieveMetadata(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Type YT.VideoData if possible from @types/youtube, otherwise use any or define structure
      const videoData: any = this.player.getVideoData();
      let playlist: string[] | null = null;
      try {
        playlist = this.player.getPlaylist(); // Can throw error if no playlist
      } catch (e) {
        console.info("No playlist found, using single video data.");
      }

      const videoIdsArray = playlist && playlist.length > 0 ? playlist : [videoData?.video_id];
      const videoIds = videoIdsArray.filter(Boolean).join(","); // Filter out potential null/undefined IDs and join

      if (!videoIds) {
        console.warn("No valid video IDs found to retrieve metadata.");
        // Ensure default metadata is set if not already
        if (this.metadata.length === 0) {
          this.metadata = [{ playback: { video_player: "youtube" }, content: {} }];
        }
        return reject(new Error("No video IDs available for metadata fetch.")); // Reject as API call can't proceed
      }

      logDebug(`Workspaceing metadata for video IDs: ${videoIds}`);

      fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=snippet,contentDetails&key=${this.apiKey}`
      )
        .then((res) => {
          if (!res.ok) {
            const err = new Error(
              `Segment request to Youtube API failed (${res.status} ${res.statusText}). Check API Key and video IDs. Events will lack detailed metadata.`
            );
            (err as any).response = res; // Attach response if needed, use any for simplicity
            throw err;
          }
          return res.json() as Promise<{
            kind: string;
            etag: string;
            items: {
              kind: string;
              etag: string;
              id: string;
              snippet: {
                publishedAt: string;
                channelId: string;
                title: string;
                description: string;
                thumbnails: {
                  [key: string]: {
                    url: string;
                    width: number;
                    height: number;
                  };
                };
                channelTitle: string;
                tags?: string[];
                categoryId: string;
                liveBroadcastContent: string;
                localized?: { title: string; description: string }; // Check if this is always present
              };
              contentDetails: {
                duration: string; // ISO 8601 duration
                dimension: string;
                definition: string;
                caption: string;
                licensedContent: boolean;
                projection: string;
              };
            }[];
            pageInfo: { totalResults: number; resultsPerPage: number };
          }>; // Type assertion for the response
        })
        .then((json) => {
          if (!json || !json.items || json.items.length === 0) {
            throw new Error("Youtube API returned empty or invalid data.");
          }

          this.metadata = []; // Clear previous metadata
          let total_length: number = 0;

          // Map API response items to our MetadataItem structure
          for (const videoInfo of json.items) {
            if (!videoInfo.snippet || !videoInfo.contentDetails) {
              console.warn(`Skipping video item due to missing data: ${videoInfo.id}`);
              continue;
            }
            this.metadata.push({
              content: {
                title: videoInfo.snippet.title,
                description: videoInfo.snippet.description,
                keywords: videoInfo.snippet.tags || [], // Ensure keywords is an array
                channel: videoInfo.snippet.channelTitle,
                airdate: videoInfo.snippet.publishedAt,
              },
              // Initialize playback object, total_length will be added later
              playback: {
                video_player: "youtube",
              },
            });
            total_length += YTDurationToSeconds(videoInfo.contentDetails.duration);
          }

          // Assign the calculated total_length to all items
          // This assumes total_length applies to the whole playlist context? Verify this logic.
          this.metadata.forEach((item) => {
            item.playback.total_length = total_length;
          });

          logDebug("Metadata successfully retrieved and processed.");
          resolve();
        })
        .catch((err) => {
          console.error("Failed to retrieve or process YouTube metadata:", err);
          // Fallback: Create basic metadata structure based on known IDs
          const ids = videoIds.split(",");
          this.metadata = ids.map(() => ({
            playback: { video_player: "youtube" },
            content: {}, // Empty content
          }));
          reject(err); // Reject the promise as metadata retrieval failed
        });
    });
  }

  // --- Event Handlers ---

  private handleBuffer(): void {
    const seekDetected: boolean = this.determineSeek();
    const currentMetadata = this.metadata[this.playlistIndex];

    if (!currentMetadata) {
      console.warn(`handleBuffer: Metadata not found for index ${this.playlistIndex}`);
      return;
    }

    if (!this.playbackStarted) {
      this.playbackStarted = true;
      this.track("Video Playback Started", currentMetadata.playback);
    }

    // Seek started (only trigger if not already seeking)
    if (seekDetected && !this.isSeeking) {
      this.isSeeking = true;
      this.track("Video Playback Seek Started", currentMetadata.playback);
    }

    // Buffering signifies seek completion if we were seeking
    if (this.isSeeking) {
      this.track("Video Playback Seek Completed", currentMetadata.playback);
      this.isSeeking = false; // Reset seeking state
    }

    // Check for playlist skip (next/previous video button)
    try {
      const playlist = this.player.getPlaylist();
      const currentIdx = this.player.getPlaylistIndex();
      if (playlist && this.player.getCurrentTime() === 0 && currentIdx !== this.playlistIndex) {
        logDebug(`Playlist index changed from ${this.playlistIndex} to ${currentIdx}`);
        this.contentStarted = false; // New content starting

        // Check if it wrapped around from end to beginning
        if (this.playlistIndex === playlist.length - 1 && currentIdx === 0) {
          const previousMetadata = this.metadata[this.playlistIndex];
          // Trigger Playback Completed for the *previous* video
          if (previousMetadata) {
            this.track("Video Playback Completed", previousMetadata.playback);
          }
          // Playback Started for the *new* video (will be triggered by handlePlay)
        }
        // Update playlistIndex *after* checks involving the previous index
        this.playlistIndex = currentIdx;
      }
    } catch (e) {
      // Ignore error if getPlaylist() fails (single video)
    }

    // Always track buffer start when entering buffering state (unless already buffering)
    if (!this.isBuffering) {
      this.track("Video Playback Buffer Started", currentMetadata.playback);
      this.isBuffering = true;
    }
  }

  private handlePlay(): void {
    let currentPlaylistIndex = -1;
    try {
      currentPlaylistIndex = this.player.getPlaylistIndex(); // Will be -1 for single video
    } catch (e) {
      // Ignore
    }
    if (currentPlaylistIndex === -1) currentPlaylistIndex = 0; // Normalize for single video

    // Update playlist index if it changed (e.g., user clicked specific video)
    if (this.playlistIndex !== currentPlaylistIndex) {
      logDebug(`Playlist index updated during play: ${currentPlaylistIndex}`);
      this.playlistIndex = currentPlaylistIndex;
      this.contentStarted = false; // Force content started event for the new index
    }

    const currentMetadata = this.metadata[this.playlistIndex];
    if (!currentMetadata) {
      console.warn(`handlePlay: Metadata not found for index ${this.playlistIndex}`);
      // Attempt to retrieve metadata again if missing?
      this.retrieveMetadata().catch((err) => console.error("Retry retrieveMetadata failed in handlePlay", err));
      return; // Exit if no metadata
    }

    // Track Content Started only once per video view
    if (!this.contentStarted) {
      this.track("Video Content Started", currentMetadata.content);
      this.contentStarted = true;
    }

    // If resuming from buffering state
    if (this.isBuffering) {
      this.track("Video Playback Buffer Completed", currentMetadata.playback);
      this.isBuffering = false;
    }

    // If resuming from paused state
    if (this.isPaused) {
      this.track("Video Playback Resumed", currentMetadata.playback);
      this.isPaused = false;
    }

    // If we were seeking (e.g. seek completed directly into playing state)
    if (this.isSeeking) {
      this.track("Video Playback Seek Completed", currentMetadata.playback);
      this.isSeeking = false;
    }
  }

  private handlePause(): void {
    const seekDetected: boolean = this.determineSeek();
    const currentMetadata = this.metadata[this.playlistIndex];

    if (!currentMetadata) {
      console.warn(`handlePause: Metadata not found for index ${this.playlistIndex}`);
      return;
    }

    // If buffering occurred before pause (e.g., seek completed, then immediately paused)
    if (this.isBuffering) {
      this.track("Video Playback Buffer Completed", currentMetadata.playback);
      this.isBuffering = false;
    }

    // Only trigger pause/seek events if not already paused
    if (!this.isPaused) {
      // If seek detected leading into the pause state
      if (seekDetected && !this.isSeeking) {
        // Check !isSeeking to avoid double events
        this.isSeeking = true; // Set seeking state
        this.track("Video Playback Seek Started", currentMetadata.playback);
        // Seek completed might happen on next play or buffer event
      }
      // If it's a simple pause without seeking
      else if (!this.isSeeking) {
        this.track("Video Playback Paused", currentMetadata.playback);
        this.isPaused = true; // Set paused state
      }
    }
  }

  private handleEnd(): void {
    const currentMetadata = this.metadata[this.playlistIndex];

    if (!currentMetadata) {
      console.warn(`handleEnd: Metadata not found for index ${this.playlistIndex}`);
      return; // Cannot track completion without metadata
    }

    // Track content completion first
    if (this.contentStarted) {
      // Only track if content actually started
      this.track("Video Content Completed", currentMetadata.content);
    }
    this.contentStarted = false; // Reset for next potential play

    // Reset states related to the finished video
    this.isPaused = false;
    this.isBuffering = false;
    this.isSeeking = false;

    let playlist: string[] | null = null;
    let playlistIndex = -1;
    try {
      playlist = this.player.getPlaylist();
      playlistIndex = this.player.getPlaylistIndex(); // This might be -1 or index of next video
    } catch (e) {
      // Ignore if single video
    }

    // Determine if this was the last video overall
    const isLastVideo = !playlist || playlist.length === 0 || this.playlistIndex === playlist.length - 1;

    if (isLastVideo) {
      // Only track Playback Completed if the *entire* playback session ends
      this.track("Video Playback Completed", currentMetadata.playback);
      this.playbackStarted = false; // Reset playback state
    } else {
      // If not the last video, the playlist might auto-advance.
      // The next video's 'PLAYING' state will handle 'Content Started' etc.
      // We might need to update this.playlistIndex here if auto-advance is detected
      // but YT API state changes are sometimes tricky. Relying on BUFFERING/PLAYING
      // to detect index changes might be safer.
      logDebug(`Video ended at index ${this.playlistIndex}, but not the last video.`);
    }
  }

  // --- Helper Methods ---

  // yt doesn't natively track seeking so we have to manually calculate whether a seek has occurred
  private determineSeek(): boolean {
    const currentPlayedSeconds = this.player.getCurrentTime();
    const secondToLastPlayedSeconds =
      this.playedSeconds.length > 1 ? this.playedSeconds[this.playedSeconds.length - 2] : -1;

    if (secondToLastPlayedSeconds === -1) {
      return false;
    }

    const diffInSeconds = Math.abs(currentPlayedSeconds - secondToLastPlayedSeconds);

    // logDebug(
    //   `Seek check: Current ${currentPlayedSeconds.toFixed(0)}s, Last ${secondToLastPlayedSeconds.toFixed(0)}s, Diff ${diffInSeconds.toFixed(0)}s`,
    // );

    // if the diff btwn the 2 is > the threshold we can reasonably assume a seek has occurred
    return diffInSeconds > 2;
  }

  // Ensure the base class's track method is compatible or override/wrap it
  // Assuming VideoPlugin has: track(eventName: string, properties: Record<string, any>): void
  protected track(eventName: (typeof this.settings.track)[number], properties: Record<string, any>): void {
    if (!this.settings.track.includes(eventName)) {
      // console.warn(`Track event ${eventName} not in settings`);
      return;
    }

    // You might want to add common properties here before sending
    const propsToSend = {
      ...properties, // Spread original properties
      // Add any other common details if needed
      // current_timestamp: new Date().toISOString(),
      previous_played_seconds: this.playedSeconds[0],
      current_played_seconds: this.player.getCurrentTime(),
      video_title: this.metadata[this.playlistIndex].content.title,
    };

    logDebug(`Tracking Event: ${eventName}`, propsToSend); // For debugging
    // super.track(eventName, propsToSend); // Call the base class track method

    browserTrackEvent(eventName, propsToSend);
  }
}

// --- Utility Function ---

/**
 * Converts YouTube ISO 8601 duration format (e.g., PT1M30S) to seconds.
 * @param duration ISO 8601 duration string
 * @returns Duration in seconds (number)
 */
function YTDurationToSeconds(duration: string | null | undefined): number {
  if (!duration) {
    return 0;
  }
  // Relaxed regex to handle variations, captures groups for H, M, S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);

  if (!match) {
    console.warn(`Could not parse YouTube duration: ${duration}`);
    return 0; // Return 0 if parsing fails
  }

  // Extract parts, default to 0 if not present
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseFloat(match[3] || "0"); // Use parseFloat for potential fractions of seconds

  return hours * 3600 + minutes * 60 + seconds;
}
