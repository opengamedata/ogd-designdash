# Configuration

[Back to README](../README.md)

## Local environment

Copy `.env.example` to `.env.local` once. Keep credentials in that ignored local file or the deployment secret store; do not add them to source control. Restart the development server after edits. Shell environment variables override values in environment files, so check the shell when a value seems ignored.

Docker excludes `.env` and `.env.*` except the example. It does not load your `.env.local`; pass public values as build arguments and private values at runtime.

| Variable | Where it is used | Value / behavior |
| --- | --- | --- |
| `DEPLOY_TARGET` | Next.js config, build/dev startup | `cloudrun` for root-path local development or standalone server; `static` for lab export. Config defaults to `static` when unset. Use exactly these values. |
| `NEXT_PUBLIC_OGD_FILES_API_URL` | Browser bundle and server API service | Files API base URL, without trailing slash or `/games`. Required for API imports, manifests, and assistant API lookup tools. TSV-only use works without it. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Browser build | Optional GA4 measurement ID. Analytics only loads in production with a nonempty ID. |
| `NEXT_PUBLIC_AI_ASSISTANT_ENABLED` | Browser build | Exactly `true` shows the Assistant panel; otherwise hidden. |
| `AI_ASSISTANT_ENABLED` | Server request time | Enables `/api/chat` only with valid provider configuration. Use `true` / `false`; the server also accepts `1` / `yes`, but the public flag and deployment workflow do not. |
| `AI_PROVIDER` | Server | `openai` or `ollama`. Unset defaults to `ollama`; an explicitly empty value is invalid when the assistant is enabled. |
| `OLLAMA_MODEL` | Server | Required for Ollama; use an installed model that supports the assistant's tool calls. |
| `OLLAMA_BASE_URL` | Server | Optional Ollama server origin; installed SDK defaults to `http://127.0.0.1:11434`. |
| `OPENAI_API_KEY` | Server only | Required for OpenAI. Never use a `NEXT_PUBLIC_` name for it. |
| `OPENAI_MODEL` | Server | Defaults to `gpt-4o-mini` when unset. Use a model available to your account that supports the assistant's tool calls. |
| `PORT`, `HOSTNAME` | Standalone container | Docker defaults: `8080`, `0.0.0.0`. For `npm run dev`, use `--port` and `--hostname` CLI options. |
| `NEXT_TELEMETRY_DISABLED` | Next.js tooling | Docker sets `1`; may also be set locally. |

**Changing a public variable requires rebuilding and redeploying the client.** Setting a different runtime API URL or assistant UI flag on an existing container does not update its browser bundle. Keep build-time and runtime API values consistent.

## Files API contract

The same service module is used by browser imports and server-side assistant lookup tools. The API must be reachable from the user's browser, allow that dashboard origin through CORS, and—when using the assistant—be reachable from the Next.js server. An HTTPS dashboard needs an HTTPS API endpoint.

The service appends these paths to the configured base:

| Path | Expected payload under `val` |
| --- | --- |
| `/games` | `{ "game_ids": ["GAME_ID"] }` |
| `/games/{game}/datasets` | `{ "game_id": "GAME_ID", "datasets": [...] }`; records include year, month, `sessions_file`, `players_file`, and `population_file` |
| `/games/{game}/datasets/{year}/{month}/{level}` | `{ "rows": [...], "columns": [...] }` |
| `/games/{game}/datasets/{year}/{month}/manifest` | Feature manifest consumed by the dataset UI and assistant |

Responses also have `type` and `msg` fields. New imports expose player and session levels; explicit legacy population links remain accepted. Check [apiService.ts](../src/services/apiService.ts) and [global types](../src/types/globals.d.ts) when an upstream response changes.

To diagnose API setup, request `<configured-base>/games` and inspect the browser Network panel. A successful curl alone does not verify CORS. Do not point this setting at the dashboard URL unless that host actually serves the Files API.

## Enable the assistant locally

Keep `DEPLOY_TARGET=cloudrun`. Set both flags and one provider in `.env.local`, then restart:

```dotenv
AI_ASSISTANT_ENABLED=true
NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true
AI_PROVIDER=openai
OPENAI_API_KEY=replace-with-your-key
OPENAI_MODEL=gpt-4o-mini
```

For local Ollama, instead set `AI_PROVIDER=ollama`, `OLLAMA_MODEL` to an installed model, and optionally `OLLAMA_BASE_URL=http://127.0.0.1:11434`. The Ollama service must be running and accessible from the Next.js process. Inside Docker, loopback refers to the container, not the host.

The server validates configuration presence, not provider connectivity or model capability. A visible panel does not prove chat is operational. With the server flag disabled, a POST to `/api/chat` returns HTTP 503 and `reason: flag_off`; missing provider configuration returns `missing_config`, and an invalid provider returns `invalid_provider`.

Chat sends conversation messages and dashboard context to the configured model provider. Feature lookup tools can retrieve API manifests; client-side tools load datasets and modify dashboards. Review provider/data-use expectations before enabling it for a shared deployment. The current route has no application-level authentication or rate limiting, and Cloud Run workflows deploy with `--allow-unauthenticated`.

For Cloud Run use the GitHub variables and Secret Manager wiring below. Static lab hosting has no chat server, regardless of environment flags.


## Deployment configuration reference

The [Cloud Run staging](../.github/workflows/CD_cloudrun_staging.yml) and [production](../.github/workflows/CD_cloudrun_prod.yml) workflows are the source of truth for deployment settings. They use GitHub environments `cloudrun-staging` and `cloudrun-prod`.

| GitHub variable | Purpose |
| --- | --- |
| `GCP_PROJECT_ID`, `GCP_REGION` | Project and region; configure at repository scope because workflows read these into top-level `env` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full Workload Identity Federation provider resource name |
| `GCP_SERVICE_ACCOUNT` | Deployer service-account email; not necessarily the Cloud Run runtime identity |
| `CLOUDRUN_OGD_FILES_API_URL` | Files API base URL, supplied to Docker build and service runtime |
| `CLOUDRUN_GA_ID` | Optional analytics ID |
| `CLOUDRUN_AI_ASSISTANT_ENABLED` | Exactly `true` enables both assistant switches; otherwise leave false/unset |
| `CLOUDRUN_AI_PROVIDER` | Defaults to `openai` when enabled; current secret wiring is OpenAI-specific |
| `CLOUDRUN_OPENAI_MODEL` | Defaults to `gpt-4o-mini` when enabled |

The workflows expect Artifact Registry repository `ogd-dashboard`. When the assistant is enabled, they bind `OPENAI_API_KEY` to Secret Manager secret `designdash-openai-api-key:latest`. The actual runtime service account needs secret access; the workflow does not explicitly select it with `--service-account`. GitHub authentication uses the [WIF action](../.github/actions/cloudrun_auth/action.yml). Public configuration changes require a new image build.

For lab hosting, the [branch](../.github/workflows/CI_designdash.yml) and [release](../.github/workflows/RELEASE_designdash.yml) workflows use variables `OGD_STAGING_HOST`, `OGD_SERVICES_HOST`, `WEB_PATH`, `API_BASE_URL`, and `GA_ID_DASHBOARD`; secrets `VPN_USER`, `VPN_PASS`, `DEPLOY_USER`, and `DEPLOY_KEY` supply VPN/SSH access. The [cleanup workflow](../.github/workflows/CLEAN_designdash.yml) also uses `CLEAN_USER` and `CLEAN_KEY`.

The [lab config action](../.github/actions/DesignDash_config/action.yml) copies `.env.example`, substitutes settings, and replaces `BASE_PATH`. Leave `DEPLOY_TARGET` unset in that template to preserve static builds. Inspect the resulting API URL: the current workflows reuse a host input for SSH and the API, but the browser needs an absolute HTTP(S) URL. The assistant substitution also matches the public flag, so `enable_ai_assist: 'true'` exposes a panel even on static hosting without a chat server. Use false for static hosting. The existing lab install steps also contain two npm commands in a folded YAML value; review them before relying on a new deployment.
