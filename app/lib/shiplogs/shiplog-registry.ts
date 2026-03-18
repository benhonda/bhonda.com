import type { ShiplogMeta, ShiplogModule } from "~/lib/shiplogs/shiplog-types";

const shiplogModules = import.meta.glob<ShiplogModule>("./entries/*.tsx", { eager: true });

const allModules: ShiplogModule[] = Object.values(shiplogModules).filter(
  (m): m is ShiplogModule => "shiplogMeta" in m,
);

export const shiplogsBySlug: Record<string, ShiplogModule> = allModules.reduce<Record<string, ShiplogModule>>(
  (acc, m) => {
    acc[m.shiplogMeta.slug] = m;
    return acc;
  },
  {},
);

/** All shiplogs sorted by publishedAt descending */
export const allShiplogs: ShiplogMeta[] = allModules
  .map((m) => m.shiplogMeta)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** Only published shiplogs */
export const publishedShiplogs: ShiplogMeta[] = allShiplogs.filter((s) => s.status === "published");
