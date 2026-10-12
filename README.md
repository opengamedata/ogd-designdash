# OpenGameData Design Dashboard

A browser-based dashboard for exploring gameplay feature datasets from TSV files or the OGD Files API. It supports draggable charts, dataset filters and splits, statistics, graph visualizations, dashboard JSON sharing, and chart image export. An optional server-side assistant can recommend features and create charts.

## Start here

| Task | Guide |
| --- | --- |
| Run locally and perform a sanity check | This page |
| Configure API access, analytics, or the assistant | [Configuration](docs/configuration.md) |
| Import data, save work, and share dashboards | [Using the dashboard](docs/usage.md) |
| Diagnose a failure | [Troubleshooting](docs/troubleshooting.md) |
| Change the code or understand persistence | [Technical documentation](technical_documentation.md) |

## Local setup

Use Node.js **22** (the major version used by Docker and CI) and npm. The original development baseline was Node 22.17.1 / npm 10.9.2. Docker is only needed to test the container; an API account or AI key is not required for the bundled TSV sanity check.

```bash
git clone https://github.com/opengamedata/ogd-designdash.git
cd ogd-designdash
npm ci
cp .env.example .env.local
DEPLOY_TARGET=cloudrun npm run dev -- --hostname 127.0.0.1 --port 3000
```

The command selects `DEPLOY_TARGET=cloudrun` for local development, so the app is available at [http://127.0.0.1:3000](http://127.0.0.1:3000), without the static deployment's `/BASE_PATH` prefix. The assistant starts disabled. Stop the server with Ctrl+C. Use another port if 3000 is occupied; browser-saved work is specific to the host and port.

To use API imports, set `NEXT_PUBLIC_OGD_FILES_API_URL` in `.env.local` to your team's Files API base URL, **without** `/games` or a trailing slash, and restart. For Cloud Run, find the deployed value in the GitHub `CLOUDRUN_OGD_FILES_API_URL` variable. For lab hosting, inspect the generated `.env.local` from the deployment workflow. No live service URL or credential is assumed by this repository.

## Five-minute sanity check

1. Open the app and upload [the synthetic player TSV](docs/examples/DEMO_20260101_to_20260131_demo_player-features.tsv) through the Data panel's TSV upload control. Keep its filename intact.
2. Select the imported dataset in a chart, choose Histogram, and click Apply. Select `Score` in the chart's settings.
3. Add a filter under the dataset, confirm the chart changes, and collapse/expand Filters and Features.
4. Change the chart to Descriptive Statistics and select Quartiles for `Score`. With no filters, the expected quartiles are **17.5, 25, 32.5**.
5. Hover over a rendered chart to download its PNG. Try clipboard copy if the browser supports it.
6. In Dashboards, rename the dashboard and export its JSON. Reload to check persistence. Import the JSON in a separate browser profile to check that the layout and its data restore.

The fixture contains only invented values. API discovery and AI chat are separate integration checks; a successful TSV test does not prove those services are configured.

## Development checks

```bash
npm test -- --runInBand --coverage=false
npm run lint
DEPLOY_TARGET=cloudrun npm run build
```

Stop the dev server before production builds. Run build targets sequentially: they share intermediate Next.js output. To check static export, override the local target explicitly:

```bash
DEPLOY_TARGET=static npm run build
```

Static output is placed in `build/`; standalone server output is in `.next/standalone/`. The Dockerfile packages and starts the standalone server with `node server.js`; static assets must be served at the configured base path (default `/BASE_PATH`). `npm start` is not the documented standalone-container entry point and cannot serve a static export.

The feature-port validation passed 46 tests, with one pre-existing page-mount test skipped, and both build targets. Lint still has known errors and is non-blocking in validation CI; see [technical documentation](technical_documentation.md) for test limitations. Counts are a recorded baseline, not a guarantee for later commits.

## Deployment model

- **Lab static:** HTML/JS assets served through the existing VPN/SSH/rsync workflows. It cannot execute `/api/chat`.
- **Cloud Run:** a standalone Next.js Node server with `/api/chat`, when explicitly enabled and configured. Staging deploys from qualifying pushes to `main`; production deploys on a released GitHub release. Both also support manual dispatch.

The workflows and container files are the source of truth for deployment behavior. The [2025 PRD](field_day_lab_visualization_dashboard_prd.md) is historical planning material, not a description of all shipped features.
