import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useAction } from "~/hooks/use-action";
import { restoreShiplogVersionActionDefinition } from "~/lib/actions/restore-shiplog-version/action-definition";

interface VersionDiffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  versionId: string;
  versionTimestamp: string;
  onRestoreComplete: () => void;
}

export function VersionDiffModal({
  open,
  onOpenChange,
  slug,
  versionId,
  versionTimestamp,
  onRestoreComplete,
}: VersionDiffModalProps) {
  const [diffLoaded, setDiffLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data, isLoading, submit } = useAction(restoreShiplogVersionActionDefinition);

  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const hasLightClass = htmlElement.classList.contains('light');

      setIsDarkMode(hasDarkClass || (!hasLightClass && prefersDark));
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => mediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  useEffect(() => {
    if (open && !diffLoaded && submit) {
      const loadData = async () => {
        await submit({
          slug,
          versionId,
          restore: false,
        });
        setDiffLoaded(true);
      };
      loadData();
    }

    if (!open) {
      setDiffLoaded(false);
    }
  }, [open, versionId, submit]);

  const handleRestore = async () => {
    await submit({
      slug,
      versionId,
      restore: true,
    });

    onRestoreComplete();
    onOpenChange(false);
  };

  const formattedDate = new Date(versionTimestamp).toLocaleString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent fullScreen>
        <DialogHeader>
          <DialogTitle>Restore Version</DialogTitle>
          <DialogDescription>
            Comparing current version with version from {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isLoading && !diffLoaded ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading diff...</p>
            </div>
          ) : data ? (
            <ReactDiffViewer
              oldValue={data.currentContent}
              newValue={data.versionContent}
              splitView={true}
              leftTitle="Current Version"
              rightTitle={`Version from ${formattedDate}`}
              useDarkTheme={isDarkMode}
              styles={{
                variables: {
                  light: {
                    diffViewerBackground: "hsl(var(--background))",
                    diffViewerColor: "hsl(var(--foreground))",
                    addedBackground: "hsl(142 76% 36% / 0.15)",
                    addedColor: "hsl(var(--foreground))",
                    removedBackground: "hsl(0 84% 60% / 0.15)",
                    removedColor: "hsl(var(--foreground))",
                    wordAddedBackground: "hsl(142 76% 36% / 0.25)",
                    wordRemovedBackground: "hsl(0 84% 60% / 0.25)",
                    addedGutterBackground: "hsl(142 76% 36% / 0.2)",
                    removedGutterBackground: "hsl(0 84% 60% / 0.2)",
                    gutterBackground: "hsl(var(--muted))",
                    gutterBackgroundDark: "hsl(var(--muted))",
                    highlightBackground: "hsl(var(--accent))",
                    highlightGutterBackground: "hsl(var(--accent))",
                  },
                  dark: {
                    diffViewerBackground: "hsl(var(--background))",
                    diffViewerColor: "hsl(var(--foreground))",
                    addedBackground: "hsl(142 76% 36% / 0.2)",
                    addedColor: "hsl(var(--foreground))",
                    removedBackground: "hsl(0 84% 60% / 0.2)",
                    removedColor: "hsl(var(--foreground))",
                    wordAddedBackground: "hsl(142 76% 36% / 0.3)",
                    wordRemovedBackground: "hsl(0 84% 60% / 0.3)",
                    addedGutterBackground: "hsl(142 76% 36% / 0.25)",
                    removedGutterBackground: "hsl(0 84% 60% / 0.25)",
                    gutterBackground: "hsl(var(--muted))",
                    gutterBackgroundDark: "hsl(var(--muted))",
                    highlightBackground: "hsl(var(--accent))",
                    highlightGutterBackground: "hsl(var(--accent))",
                  },
                },
              }}
            />
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="secondary-filled" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRestore} disabled={isLoading || !diffLoaded}>
            {isLoading && diffLoaded ? "Restoring..." : "Restore This Version"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
