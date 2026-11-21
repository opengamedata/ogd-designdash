## Background

Field Day Lab processes rich gameplay data—population, session, and player features—via a data pipeline that outputs both TSV files and API endpoints. Currently, game designers, researchers, and educators lack an interactive, flexible way to explore and analyze these data, slowing insights and feedback loops. The Open Game Data visualization dashboard aims to empower educators, designers, and analysts to rapidly surface trends, patterns, and anomalies in game-based learning data.

## Key Features

1. **Multi-Visualization Support**
   - Pre-built components for histogram, bar chart, scatterplot, box plot, descriptive statistics, force graph, timeline.
   - Plugin interface for adding new chart types.
2. **Grid-Based UI**
   - Responsive, draggable/resizable panels using CSS Grid or a library (e.g., react-grid-layout).
   - Save and restore layout configurations.
3. **Data Source Selection**
   - Per-panel selector: choose between file upload or API endpoint.
   - Display validation errors for unsupported TSV schemas or API failures.
4. **File Upload & API Integration**
   - TSV parser with schema detection and mapping to feature sets.
   - Configurable API client supporting pagination and filter parameters.
5. **API Caching**
   - Implement caching layer in LocalStorage with TTL.
   - Cache invalidation controls (per-session or manual refresh).

## Dashboard updates

- Download individual charts as PNG images or copy them to the clipboard.
- Chart titles follow dataset changes unless customized; comparison settings preserve the second dataset when the first changes.
- Dataset Filters and Features sections collapse independently. Multi-select menus include Select all, Select none, and Exclude selection.
- Descriptive statistics include quartiles and consistent number formatting; categorical bar charts sort alphabetically.
- Force graphs and Sankey diagrams aggregate graph features across filtered player/session rows. Cached datasets refresh their graph metadata on load.
- New API imports and assistant dataset requests use player/session data. Dataset links default to player data. Legacy population TSV parsing and explicit population links remain supported, but Sankey no longer uses the old job-graph data source.

These updates retain the static lab and Cloud Run deployment targets described below. Assistant UI visibility still uses `NEXT_PUBLIC_AI_ASSISTANT_ENABLED` at build time; the homepage does not require server-side rendering.

## Technical Requirements

- **Framework:** React or Next.js with TypeScript.
- **State Management:** Zustand for layout, data-layer, and cache state.
- **Visualization Library:** D3.js.
- **Data Abstraction Layer:** Adapter pattern to normalize TSV and API responses into a common format.
- **Caching Strategy:** IndexedDB for dataset caching.
- **Testing:** Unit tests for components (Jest + React Testing Library); integration tests for data adapters.

## User Stories

- **As a designer**, I want to fetch player features via API and view a force graph, so I can trace player progression.
- **As a researcher**, I want to upload a session TSV file to generate a visualization dashboard, so I can inspect distribution of session durations.
- **As a stakeholder**, I want the dashboard to load cached data instantly on revisit, so I save time waiting for API calls.

## Assumptions & Constraints

- API schema may evolve; data adapter layer must handle minor breaking changes.
- TSV files follow a consistent feature naming convention; major schema shifts require manual adapter updates.
- Users have modern browsers supporting ES6 and LocalStorage.

## Running the App locally

Make sure you have node v22.17.1 (or newer) and npm v10.9.2 (or newer) install on your machine.

Copy `.env.example` to `.env.local` and optionally add your Google Analytics measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) for usage tracking. Analytics only runs in production when the ID is set.

### Chat AI provider

The in-app assistant is **opt-in**. Set `AI_ASSISTANT_ENABLED=true` and `NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true` in `.env.local` and configure a valid provider below. When the server flag is off or provider env vars are missing, `/api/chat` returns 503. When the public flag is off, the Assistant side panel is hidden.

| Variable | Required when | Purpose |
| -------- | ------------- | ------- |
| `AI_ASSISTANT_ENABLED` | Yes (to enable `/api/chat`) | Server master switch; unset or `false` disables the API |
| `NEXT_PUBLIC_AI_ASSISTANT_ENABLED` | Yes (to show Assistant UI) | Client build-time switch for the side panel |
| `AI_PROVIDER` | When assistant enabled (default `ollama`) | `ollama` or `openai` |
| `OLLAMA_MODEL` | `AI_PROVIDER=ollama` | Ollama model name |
| `OLLAMA_BASE_URL` | No | Custom Ollama host (default `http://127.0.0.1:11434`) |
| `OPENAI_API_KEY` | `AI_PROVIDER=openai` | OpenAI API key (server only) |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |

**Per-environment guidance:**

- **Local dev (with Ollama):** `AI_ASSISTANT_ENABLED=true`, `NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true`, `AI_PROVIDER=ollama`, `OLLAMA_MODEL=<your-model>`
- **Cloud Run with LLM:** both assistant flags `true`, `AI_PROVIDER=openai`, plus Secret Manager `OPENAI_API_KEY`
- **Prod without LLM / static lab export:** both flags `false` (provider vars can be omitted)

Restart the dev server after changing env vars.

Install relevant npm packages:
`npm install`

For development:
`npm run dev`

Visit `localhost:3000` on your web broswer.

### Deploy targets

This repo supports two deploy paths that **coexist**:

| Target | How | Trigger |
| ------ | --- | ------- |
| **Lab static** (existing) | `DEPLOY_TARGET=static` (default) → static export + VPN/rsync | [`.github/workflows/CI_designdash.yml`](.github/workflows/CI_designdash.yml), [`RELEASE_designdash.yml`](.github/workflows/RELEASE_designdash.yml) |
| **Cloud Run** | `DEPLOY_TARGET=cloudrun` → Next.js standalone Node server | CI / Release call [`BUILD_designdash.yml`](.github/workflows/BUILD_designdash.yml) and [`DEPLOY_designdash.yml`](.github/workflows/DEPLOY_designdash.yml) |

Local Cloud Run-style build:

```bash
DEPLOY_TARGET=cloudrun npm run build
```

Local Docker image (optional; requires Docker):

```bash
# Build on the same Linux/Node base as the runtime, including native dependencies.
docker run --rm -v "$PWD:/app" -w /app \
  -e DEPLOY_TARGET=cloudrun \
  -e NEXT_PUBLIC_OGD_FILES_API_URL=https://example.com/api \
  -e NEXT_PUBLIC_AI_ASSISTANT_ENABLED=false \
  node:22-bookworm-slim sh -c 'npm ci && npm run build'
docker build -t designdash:local .
docker run --rm -p 8080:8080 -e AI_ASSISTANT_ENABLED=false designdash:local
```

The Dockerfile only packages `.next/standalone`, `.next/static`, and `public`.
App compilation runs as a named GitHub Actions step in a Node 22 Bookworm
container (matching the runtime); its logs are separate from image packaging.
`NEXT_PUBLIC_*` values must be supplied to **the app build**. Runtime `docker run -e`
values cannot change the compiled browser bundle. Docker build arguments are no longer needed.

## Cloud Run (staging + production)

v1 deploys two services only (no per-branch previews): `designdash-staging` and `designdash-prod`. Lab VPN/rsync deployment remains available in the existing CI and release pipelines.

### One-time GCP setup

1. Enable APIs: Cloud Run, Artifact Registry, IAM Credentials (for Workload Identity Federation). Secret Manager only if you later enable the assistant.
2. Create Artifact Registry Docker repo `ogd-dashboard` in your region (e.g. `us-central1-docker.pkg.dev/<project>/ogd-dashboard`).
3. Create separate service accounts for image publishing, deployment, and the runtime:
   - **Builder** (`GCP_BUILD_SERVICE_ACCOUNT`): `roles/artifactregistry.writer` on the `ogd-dashboard` repository only.
   - **Deployer** (`GCP_SERVICE_ACCOUNT`): `roles/run.developer` on the pre-created services, `roles/artifactregistry.reader` on the image repository, and `roles/iam.serviceAccountUser` on the runtime service account only.
   - **Runtime** (`GCP_RUNTIME_SERVICE_ACCOUNT`): no deployment or image publishing roles.
4. An administrator must create `designdash-staging` and `designdash-prod` with the runtime identity and grant `allUsers` the `roles/run.invoker` role on each service for public dashboard access. CI updates existing services and never changes their IAM policies. This avoids requiring `roles/run.admin`; see [Cloud Run deployment permissions](https://docs.cloud.google.com/run/docs/deploying).
5. Configure [Workload Identity Federation](https://github.com/google-github-actions/auth#workload-identity-federation-through-a-service-account) for both the builder and deployer service accounts (no JSON keys). Restrict the trust to this repository and the intended deployment branches/environments.
6. In the GitHub repo, create Environments **`cloudrun-staging`** and **`cloudrun-prod`** (optional approval on prod). Build and deploy are separate jobs and authenticate as different service accounts.

We retain Artifact Registry to keep images private with Google IAM access and no
additional registry bridge. Cloud Run also supports **public** GHCR images directly;
**private** GHCR images require an Artifact Registry remote repository. See
[supported registries](https://docs.cloud.google.com/run/docs/deploying#supported_container_registries_and_images).

Optional (assistant off by default): create Secret Manager secret `designdash-openai-api-key` and grant the Cloud Run runtime SA `roles/secretmanager.secretAccessor` only when you set `CLOUDRUN_AI_ASSISTANT_ENABLED=true`.

### GitHub repository / environment variables

Set these repo (or environment-scoped) variables for the Cloud Run workflows:

| Variable | Purpose |
| -------- | ------- |
| `GCP_PROJECT_ID` | GCP project ID |
| `GCP_REGION` | e.g. `us-central1` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full WIF provider resource name |
| `GCP_BUILD_SERVICE_ACCOUNT` | Image publisher service account email |
| `GCP_SERVICE_ACCOUNT` | Deployer service account email |
| `GCP_RUNTIME_SERVICE_ACCOUNT` | Runtime service account email |
| `CLOUDRUN_OGD_FILES_API_URL` | Public HTTPS OGD Files API base URL (`NEXT_PUBLIC_OGD_FILES_API_URL`) |
| `CLOUDRUN_GA_ID` | Optional GA4 measurement ID |
| `CLOUDRUN_AI_ASSISTANT_ENABLED` | Leave unset/`false` (default). Only set `true` if enabling the assistant |
| `CLOUDRUN_AI_PROVIDER` | Only needed when assistant enabled (`openai`) |
| `CLOUDRUN_OPENAI_MODEL` | Only needed when assistant enabled (defaults to `gpt-4o-mini`) |

`NEXT_PUBLIC_*` values are passed as environment variables to the app build (client bundles bake them in at build time). Prefer environment-scoped vars if staging and prod need different API/GA values.

### Workflows

- **CI** (`CI_designdash.yml`): pull requests and matching pushes run lint (non-blocking while debt exists), tests, and both static/standalone builds. PRs never deploy or authenticate to GCP. Push/manual runs retain lab deployment; only `main` builds and deploys Cloud Run staging after validation.
- **Release** (`RELEASE_designdash.yml`): validates before lab deployment. Full releases (`released`) and manual runs also build/deploy Cloud Run production; prereleases retain lab deployment only.
- **Build** (`BUILD_designdash.yml`, `workflow_call`): compiles the app, authenticates the image publisher, then uses `docker/build-push-action` to publish the runtime image. Returns its immutable digest reference, avoiding tag races between environments or reruns.
- **Deploy** (`DEPLOY_designdash.yml`, `workflow_call`): authenticates the deployer, uses `google-github-actions/deploy-cloudrun`, then smoke-tests `GET /`. This workflow owns the service's environment variables and secret mappings; disabling the assistant removes its secret mapping.

Auth uses [`.github/actions/cloudrun_auth`](.github/actions/cloudrun_auth/action.yml) (WIF). Do not reuse `DesignDash_config` (lab static path only).

### Runtime notes

- Cloud Run listens on `$PORT` (image defaults to `8080`).
- Ollama is for local dev only; use OpenAI (or leave the assistant disabled) on Cloud Run.
- OGD Files API must be reachable from Cloud Run over public HTTPS in v1 (no Cloud VPN / private egress).

### Static hosting and the assistant

`getServerSideProps` was replaced with the build-time
`NEXT_PUBLIC_AI_ASSISTANT_ENABLED` flag in `src/pages/index.tsx`. The lab static
export needs no Node server and leaves the assistant hidden. The assistant calls
the same-origin `/api/chat` endpoint; Cloud Run hosts that endpoint and checks
`AI_ASSISTANT_ENABLED` plus provider configuration at request time. Enabling the
browser flag alone does not provide an assistant backend on static hosting.
