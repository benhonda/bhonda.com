import { analyticsBrowser } from "./analytics.defaults.client";

export type TrackEvents = {
  /**
   * TRACK - Language Toggled
   *
   * @description Track when a user toggles the language of the site
   */
  "Language Toggled": {
    switchingFromLanguage: "en" | "fr";
    switchingToLanguage: "en" | "fr";
    locationOnPage: "directory-menu" | "footer";
  };

  /**
   * TRACK - YouTube Video Events
   *
   * @description Track when a user starts, seeks, buffers, pauses, resumes, completes, or progresses through a YouTube video
   */
  "Video Content Started": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // content properties
    position?: number;
    title?: string;
    description?: string;
    keywords?: string[];
    channel?: string;
    airdate?: string; // ISO 8601 date string
  };
  "Video Content Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // content properties
    position?: number;
    title?: string;
    description?: string;
    keywords?: string[];
    channel?: string;
    airdate?: string; // ISO 8601 date string
  };
  "Video Playback Started": any;
  "Video Playback Seek Started": any;
  "Video Playback Seek Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };
  "Video Playback Buffer Started": any;
  "Video Playback Buffer Completed": any;
  "Video Playback Paused": any;
  "Video Playback Resumed": any;
  "Video Playback Completed": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };
  "Video Progress Reached": {
    // custom-added properties
    previous_played_seconds: number;
    current_played_seconds: number;
    video_title: string;
    // ad-hoc properties
    watched_percentage: number;
    // playback properties
    video_player: string;
    position?: number;
    quality?: string | "unknown";
    sound?: number;
    total_length?: number;
  };

  /**
   * TRACK - Shiplog Opened
   *
   * @description Track when a user opens a shiplog detail page
   */
  "Shiplog Opened": {
    slug: string;
    week: number;
  };

  /**
   * TRACK - Shiplog Read
   *
   * @description Track when a user scrolls to reactions section (read completion proxy)
   */
  "Shiplog Read": {
    slug: string;
    week: number;
    time_to_read_seconds: number;
  };

  /**
   * TRACK - Shiplog Reaction Added
   *
   * @description Track when a user adds a reaction to a shiplog
   */
  "Shiplog Reaction Added": {
    slug: string;
    week: number;
    reaction_type: string;
  };

  /**
   * TRACK - Shiplog Reaction Removed
   *
   * @description Track when a user removes a reaction from a shiplog
   */
  "Shiplog Reaction Removed": {
    slug: string;
    week: number;
    reaction_type: string;
  };
};

/**
 * TRACK - Track an event
 *
 * @description Track an event
 */
export function browserTrackEvent<E extends keyof TrackEvents>(eventName: E, eventProps: TrackEvents[E]) {
  analyticsBrowser.track(eventName, eventProps ?? {});
}

/**
 * IDENTIFY - Identify a user
 *
 * @description Identify a user
 */
export function browserIdentifyEvent(eventProps: {
  userId?: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}) {
  if (eventProps.userId) {
    analyticsBrowser.identify(eventProps.userId, eventProps);
  } else {
    analyticsBrowser.identify(eventProps);
  }
}

/**
 * PAGE - Page Viewed
 *
 * @description Track when a user views a page
 */
export function browserPageEvent(eventProps: { language: "en" | "fr" }) {
  analyticsBrowser.page(undefined, undefined, {
    ...eventProps,
  });
}
