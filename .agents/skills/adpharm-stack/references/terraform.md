# Infrastructure — Terraform + Terragrunt (Vercel project scaffolding)

Scaffolds a project's infra: centralized Terragrunt **remote state**, a **Vercel project**
with **OIDC** AWS access, TF-**owned Vercel env vars**, and **Route53 DNS** — across one
environment or two (production ± staging), the end user's choice. Owns the env-var
ownership split that `env.md` links to.

**Scope:** Vercel-project setup only — state, env vars, OIDC, DNS. **Not** Lambda / ECS /
RDS / Step Functions / BunnyNet / shared VPCs — add a module for those only when a project
genuinely needs one (KISS/YAGNI).

**Read when:** scaffolding infra, adding a second environment, or managing a project's
Vercel env vars / OIDC / DNS.

## Contract
- Layout matches the Taskfile: a `shared` stack (multi-tenant: DNS zones) plus one stack
  per environment (`production`, optionally `staging`); `task tf* ENV=…` plans/applies
  `shared` first, then the env (`references/taskfile.md` owns the commands).
- Remote state is centralized in **`terraform-state-sensitive`** (profile `pharmer`,
  region `ca-central-1`), keyed per project/path; Terragrunt generates backend + provider.
- Vercel reaches AWS via an **OIDC role** (no stored keys); the role ARN is a TF-managed
  env var. Vercel env vars are **owned by Terraform**.

## Non-negotiables
| key | rule | why |
| --- | --- | --- |
| env-tiers-default | **production + staging is the default — provision both unless the user explicitly opts into production-only.** staging is `infra/live/staging/` (a copy of `production` with `env="staging"`); both run via `task tf* ENV=production\|staging` | don't make the user re-ask for staging every time; prod-only is the deliberate exception, not the baseline |
| layout | the `tf*` tasks (below) **and** this layout are owned **here**: `infra/live/{shared,<env>}` + `infra/modules/{shared,stack}`, `ENV=production\|staging`, shared planned first. **Always keep a `live/shared`** (the tasks plan it first) even if it only holds the Route53 zone | tasks + layout in one file → they can't drift |
| shared-vs-stack | **shared** = multi-tenant (Route53 hosted zones); **stack** (per-env) = the OIDC role, Vercel env vars, Vercel domain, and the env's DNS records | DNS zones are shared; everything env-specific is isolated per env |
| state-sensitive | state in S3 `terraform-state-sensitive` (encrypted), profile `pharmer`, region `ca-central-1`; Terragrunt generates `backend.tf`/`provider.tf` | shared, isolated team state |
| dependency-mock | env stacks read shared via a `dependency "shared"` block with `mock_outputs` | env `plan` runs before shared is applied |
| env-var-ownership | **TF-managed** = infra outputs (role ARN, region, bucket…), overwritten each apply; **manual secrets** = placeholders with `lifecycle { ignore_changes = [value] }`; all `sensitive = false`. Production stack → `target = ["production"]` **when staging exists**, else (prod-only) all three `["production","preview","development"]`; staging stack → a `vercel_custom_environment` (branch-tracked) + `target = ["preview","development"]` | one owner for deployed env vars; humans set secret values in the dashboard without TF clobbering them. Prod-only must still feed preview/dev deploys, so it covers all targets. Mirror new vars into `references/env.md` |
| oidc-not-keys | Vercel→AWS via an OIDC role (`oidc.vercel.com/<team>` trust, env-scoped `sub`); expose `aws_iam_role.vercel.arn` as the TF-managed `AWS_ROLE_ARN` | no long-lived AWS keys |
| dns-zones-vs-records | the **root domain is the hosted zone** (usually pre-existing → import via `data`, in shared); subdomains are **records** (per-env, in stack); bind with `vercel_project_domain` | don't make a zone per subdomain |
| never-apply | verify with `task tfplan ENV=…` (a clean plan is "done"); the **never-`apply`** rule is a global guardrail → SKILL.md, and IAM ALLOW-only → `references/aws-oidc.md` | this row owns only the terraform-local verify command; both prohibitions live once, elsewhere |
| team-constants | `pharmer` / `ca-central-1` / `terraform-state-sensitive` are fixed; Vercel API token = SSM Parameter Store **`/adpharm/vercel-api-token-benhonda`**. Team slug is a per-project input | team facts, not guessable |

## Layout (matches the Taskfile)
```
infra/
├── root.hcl                    # root: state + generated backend/provider (Terragrunt root config)
├── live/
│   ├── shared/terragrunt.hcl   # → modules/shared (Route53 zones)
│   ├── production/terragrunt.hcl  # → modules/stack (env="production")
│   └── staging/terragrunt.hcl     # second env (env="staging") — default; omit only for prod-only projects
└── modules/
    ├── shared/                 # hosted zones + outputs (zone ids)
    └── stack/                  # OIDC role, Vercel env vars, Vercel domain, DNS records
```

## Shape — write fresh, verify provider resource names (illustration, not gospel)
```hcl
# infra/root.hcl (root) — centralized state + generated provider
locals { aws_profile = "pharmer"; aws_region = "ca-central-1"; project_name = "my-project" }
remote_state {
  backend = "s3"; generate = { path = "backend.tf", if_exists = "overwrite" }
  config = { bucket = "terraform-state-sensitive",
    key = "${local.project_name}/${path_relative_to_include()}/terraform.tfstate",
    region = local.aws_region, profile = local.aws_profile, encrypt = true }
}
inputs = { project_name = local.project_name, aws_profile = local.aws_profile, aws_region = local.aws_region }
```
```hcl
# infra/live/production/terragrunt.hcl — an env stack reading shared
terraform { source = "../../modules/stack" }
include "root" { path = find_in_parent_folders("root.hcl") }
dependency "shared" {
  config_path  = "../shared"
  mock_outputs = { root_zone_id = "Z123MOCK" }   # lets `plan` run before shared is applied
}
inputs = {
  env = "production"; vercel_project_id = "prj_…"; vercel_team_slug = "adpharm"
  root_zone_id = dependency.shared.outputs.root_zone_id; subdomain = "app"
  has_staging = true   # default; set false for a prod-only project → prod env vars also target preview+development
  manual_secrets = { DATABASE_URL = "…", SESSION_SECRET = "…" }
}
# staging (default): copy this dir, set env="staging", subdomain="app-staging"
```
```hcl
# modules/stack/vercel-env-vars.tf — Terraform owns the env vars
# Vercel API token: shared SSM Parameter Store SecureString
data "aws_ssm_parameter" "vercel_token" { name = "/adpharm/vercel-api-token-benhonda" }
provider "vercel" {
  api_token = data.aws_ssm_parameter.vercel_token.value
  team      = var.vercel_team_slug
}
locals {
  tf_managed = { AWS_ROLE_ARN = aws_iam_role.vercel.arn, AWS_REGION = var.aws_region }  # from outputs
  is_prod    = var.env == "production"
  # prod-only (no staging) → prod stack must cover all Vercel targets, else preview/dev deploys get no env vars
  targets    = local.is_prod ? (var.has_staging ? ["production"] : ["production", "preview", "development"]) : ["preview", "development"]
}
resource "vercel_custom_environment" "env" {           # only for non-production envs
  count = local.is_prod ? 0 : 1
  project_id = var.vercel_project_id; name = var.env
  branch_tracking = { pattern = var.env, type = "equals" }
}
resource "vercel_project_environment_variable" "managed" {
  for_each = local.tf_managed
  project_id = var.vercel_project_id; key = each.key; value = each.value; sensitive = false
  target                 = local.targets
  custom_environment_ids = local.is_prod ? null : [vercel_custom_environment.env[0].id]
}
resource "vercel_project_environment_variable" "manual" {
  for_each = var.manual_secrets
  project_id = var.vercel_project_id; key = each.key; value = "SET_IN_VERCEL_DASHBOARD"; sensitive = false
  target                 = local.targets
  custom_environment_ids = local.is_prod ? null : [vercel_custom_environment.env[0].id]
  lifecycle { ignore_changes = [value] }              # never clobber the human-set value
}
```
```hcl
# modules/stack/oidc.tf — Vercel assumes this AWS role (provider already exists in the account)
data "aws_iam_openid_connect_provider" "vercel" { url = "https://oidc.vercel.com/${var.vercel_team_slug}" }
resource "aws_iam_role" "vercel" {
  name = "${var.project_name}-${var.env}-vercel"
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{
    Effect = "Allow", Principal = { Federated = data.aws_iam_openid_connect_provider.vercel.arn },
    Action = "sts:AssumeRoleWithWebIdentity",
    Condition = { StringLike = { "oidc.vercel.com/${var.vercel_team_slug}:sub" =
      "owner:${var.vercel_team_slug}:project:${var.vercel_project_name}:environment:${var.env}" } } }] })
}
# modules/stack/route53.tf — subdomain record in the shared zone, bound to Vercel
resource "vercel_project_domain" "app" { project_id = var.vercel_project_id; domain = "${var.subdomain}.${var.root_domain}" }
resource "aws_route53_record" "app" {
  zone_id = var.root_zone_id; name = var.subdomain; type = "CNAME"; ttl = 300; records = ["cname.vercel-dns.com"]
}
```

## Deploy
`task tfplan ENV=production` (plans shared then the env) → review → user runs `task tfapply
ENV=production`. For two envs, repeat with `ENV=staging`. Set manual-secret values in the
Vercel dashboard after first apply. Commands live in `references/taskfile.md`.

## Tasks — append to the project Taskfile (core lives in `references/taskfile.md`)
`deps: [check-aws-identity]` references the core's identity gate. `ENV=production|staging`;
every command plans/applies `shared` first.
```yaml
_validate-env:
  internal: true
  requires: { vars: [ENV] }
  cmds:
    - 'case "{{.ENV}}" in production|staging) ;; *) echo "ENV must be production|staging"; exit 1 ;; esac'

tfplan:
  desc: Terragrunt plan (ENV=production|staging) — plans shared first
  requires: { vars: [ENV] }
  deps: [check-aws-identity]
  dir: infra/live/{{.ENV}}
  cmds:
    - task: _validate-env
    - task: tfplan:shared
    - terragrunt plan {{.CLI_ARGS}}
tfplan:shared:
  deps: [check-aws-identity]
  dir: infra/live/shared
  cmds:
    - terragrunt plan {{.CLI_ARGS}}

tfapply:
  desc: Terragrunt apply (ENV=…) — applies shared then env
  interactive: true
  requires: { vars: [ENV] }
  deps: [check-aws-identity]
  dir: infra/live/{{.ENV}}
  cmds:
    - task: _validate-env
    - task: tfapply:shared
    - terragrunt apply {{.CLI_ARGS}}
tfapply:shared:
  internal: true
  interactive: true
  dir: infra/live/shared
  cmds:
    - terragrunt apply {{.CLI_ARGS}}

tfinit:
  requires: { vars: [ENV] }
  deps: [check-aws-identity]
  dir: infra/live/{{.ENV}}
  cmds:
    - task: _validate-env
    - terragrunt init {{.CLI_ARGS}}
tffmt:
  cmds:
    - terraform fmt -recursive infra/
# tfdestroy / tfimport / tflist / tfrefresh / tfoutput follow the same ENV-scoped pattern.
```

## Verify at latest
- **Terraform, Terragrunt, AWS + Vercel providers** — current versions on the Registry; use
  `~>`; confirm current schemas (`vercel_project_environment_variable`,
  `vercel_custom_environment`, `vercel_project_domain`, `aws_iam_openid_connect_provider`).
