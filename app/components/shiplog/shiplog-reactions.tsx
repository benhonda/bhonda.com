import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { SmilePlus } from "lucide-react";
import { useAction } from "~/hooks/use-action";
import { toggleShiplogReactionActionDefinition } from "~/lib/actions/toggle-shiplog-reaction/action-definition";
import { REACTION_TYPES, REACTION_EMOJI_MAP, type ReactionType } from "~/lib/shiplog/reactions";
import { cn } from "~/lib/utils";
import { analyticsBrowser } from "~/lib/analytics/analytics.defaults.client";

interface ShiplogReactionsProps {
  shiplogSlug: string;
  initialCounts: Record<string, number>;
  initialUserReactions: string[];
}

export function ShiplogReactions({
  shiplogSlug,
  initialCounts,
  initialUserReactions,
}: ShiplogReactionsProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { submit, isLoading, data, error } = useAction(toggleShiplogReactionActionDefinition);

  // Use optimistic state
  const [counts, setCounts] = useState(initialCounts);
  const [userReactions, setUserReactions] = useState(initialUserReactions);

  // Sync with server response
  useEffect(() => {
    if (data) {
      setCounts(data.counts);
      setUserReactions(data.userReactions);
    }
  }, [data]);

  // Revert on error
  useEffect(() => {
    if (error) {
      setCounts(initialCounts);
      setUserReactions(initialUserReactions);
    }
  }, [error, initialCounts, initialUserReactions]);

  const handleReactionClick = async (reactionType: ReactionType) => {
    // Get anonymous ID from Segment
    const anonymousId = analyticsBrowser.instance?.user().anonymousId();

    if (!anonymousId) {
      console.error("No anonymous ID found from analytics");
      return;
    }

    // Optimistic update
    const wasActive = userReactions.includes(reactionType);
    const newUserReactions = wasActive
      ? userReactions.filter((r) => r !== reactionType)
      : [...userReactions, reactionType];

    const newCounts = { ...counts };
    if (wasActive) {
      newCounts[reactionType] = Math.max((newCounts[reactionType] || 0) - 1, 0);
      if (newCounts[reactionType] === 0) {
        delete newCounts[reactionType];
      }
    } else {
      newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
    }

    setUserReactions(newUserReactions);
    setCounts(newCounts);
    setPopoverOpen(false);

    // Submit to server
    await submit({
      shiplogSlug,
      reactionType,
      anonymousId,
    });
  };

  // Get reactions with counts > 0
  const reactionsWithCounts = REACTION_TYPES.filter((type) => (counts[type] || 0) > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Display reactions with counts */}
      {reactionsWithCounts.map((reactionType) => {
        const count = counts[reactionType] || 0;
        const isActive = userReactions.includes(reactionType);

        return (
          <button
            key={reactionType}
            onClick={() => handleReactionClick(reactionType)}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-full border transition-all",
              "hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed",
              isActive
                ? "bg-primary/10 border-primary text-primary font-medium"
                : "bg-background border-border text-muted-foreground"
            )}
          >
            <span className="text-base leading-none">{REACTION_EMOJI_MAP[reactionType]}</span>
            <span className="text-sm font-mono leading-none">{count}</span>
          </button>
        );
      })}

      {/* Add reaction popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all",
              "hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed",
              "bg-background border-border text-muted-foreground"
            )}
          >
            <SmilePlus className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {REACTION_TYPES.map((reactionType) => {
              const isActive = userReactions.includes(reactionType);

              return (
                <button
                  key={reactionType}
                  onClick={() => handleReactionClick(reactionType)}
                  disabled={isLoading}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-md transition-all text-2xl",
                    "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",
                    isActive && "bg-primary/10"
                  )}
                  title={reactionType.replace(/_/g, " ")}
                >
                  {REACTION_EMOJI_MAP[reactionType]}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
