import { useSyncExternalStore } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useI18n } from "~/hooks/use-i18n";
import { isAnalyticsOptedOut, setAnalyticsOptedOut, subscribeConsent } from "~/lib/analytics/consent.client";

/**
 * Footer link → dialog letting a visitor opt out of anonymous analytics.
 *
 * Reflects + drives the silo consent gate via the consent store. The choice is
 * read through useSyncExternalStore so the toggle stays in sync if changed
 * elsewhere; server snapshot is "not opted out" (silo no-ops on the server).
 */
export function AnalyticsConsentDialog() {
  const { t } = useI18n();

  const optedOut = useSyncExternalStore(
    subscribeConsent,
    isAnalyticsOptedOut,
    () => false
  );

  return (
    <Dialog>
      <DialogTrigger className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors">
        {t("Privacy", "Confidentialité")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Privacy", "Confidentialité")}</DialogTitle>
          <DialogDescription>
            {t(
              "I track anonymous visits to see what's working — no personal details, never sold. Flip this off anytime.",
              "Je suis les visites de façon anonyme pour voir ce qui fonctionne — aucune donnée personnelle, jamais vendue. Désactivez quand vous voulez."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-4 py-2">
          <Label htmlFor="analytics-opt-out" className="cursor-pointer">
            {t("Opt out of anonymous analytics", "Refuser les analyses anonymes")}
          </Label>
          <Switch
            id="analytics-opt-out"
            checked={optedOut}
            onCheckedChange={setAnalyticsOptedOut}
            aria-label={t("Opt out of anonymous analytics", "Refuser les analyses anonymes")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
