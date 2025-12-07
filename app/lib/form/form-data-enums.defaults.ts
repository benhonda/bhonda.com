import type { I18NFunction } from "./form-config-types";

export function getEnumVal<T extends readonly string[]>(_enum: T, value: T[number]): T[number] | undefined {
  return _enum.find((v) => v === value);
}

export const yesNoEnum = ["yes", "no"] as const;

export const mapToYesNoEnumLabels = (key: string, l: I18NFunction) => {
  const map: Record<(typeof yesNoEnum)[number], string> = {
    yes: l("Yes", "Oui"),
    no: l("No", "Non"),
  };
  return map[key as (typeof yesNoEnum)[number]] ?? l("Unknown", "Inconnu");
};

/**
 *
 */
export const eventbridgeRawEventsStatusEnum = ["dispatched", "in_progress", "success", "failed"] as const;

export const mapToEventbridgeRawEventsStatusEnumLabels = (key: string, l: I18NFunction) => {
  const map: Record<(typeof eventbridgeRawEventsStatusEnum)[number], string> = {
    dispatched: l("Dispatched", "En attente"),
    in_progress: l("In Progress", "En attente"),
    success: l("Success", "Succès"),
    failed: l("Failed", "Échec"),
  };
  return map[key as (typeof eventbridgeRawEventsStatusEnum)[number]] ?? l("Unknown", "Inconnu");
};
