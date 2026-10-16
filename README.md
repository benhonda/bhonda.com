# bhonda.com

Ben Honda's personal site, being rebuilt from scratch on the Adpharm stack.

- The app lives in `web/` (React Router on Vercel). Run `task --list-all` for every command; `Taskfile.yml` is the source of truth for how things run.
- Infra (Terragrunt) lives in `web/infra/`.
- The previous version of the site (blog, weekly shiplogs, people, projects) is preserved at git tag `archive/v1`. Its old URLs now answer 410 Gone - see `web/app/lib/router/retired-paths.ts`.
