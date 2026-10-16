import type { Route } from "./+types/_index";
import { ThemeToggle } from "~/components/theme-toggle";

export const meta: Route.MetaFunction = () => [
  { title: "Ben Honda" },
  { name: "description", content: "Ben Honda's personal site, currently being rebuilt." },
];

const linkClassName = "font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <img src="/favicon.svg" alt="" className="size-10" />
      <h1 className="text-3xl font-semibold tracking-tight">Ben Honda</h1>
      <p className="leading-relaxed text-muted-foreground">
        I took the old site down and I'm building a new one from scratch. Until it's ready you can find me on{" "}
        <a href="https://github.com/benhonda" className={linkClassName}>
          GitHub
        </a>{" "}
        or{" "}
        <a href="https://www.linkedin.com/in/benhonda/" className={linkClassName}>
          LinkedIn
        </a>
        .
      </p>
    </main>
  );
}
