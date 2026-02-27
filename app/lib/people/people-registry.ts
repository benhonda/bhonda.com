import type { PersonMeta, PersonModule } from "~/lib/people/people-types";

const profileModules = import.meta.glob<PersonModule>("./profiles/*.tsx", { eager: true });

const allModules: PersonModule[] = Object.values(profileModules).filter(
  (m): m is PersonModule => "personMeta" in m,
);

export const profilesBySlug: Record<string, PersonModule> = allModules.reduce<Record<string, PersonModule>>(
  (acc, m) => {
    acc[m.personMeta.slug] = m;
    return acc;
  },
  {},
);

export const publishedPeople: PersonMeta[] = allModules
  .map((m) => m.personMeta)
  .filter((p) => p.status === "published")
  .sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? ""));
