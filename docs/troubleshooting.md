# Troubleshooting

[Back to README](../README.md)

Start by recording the URL, deployed commit/revision, browser, dataset source, and the failing action. Check browser Console/Network for frontend/API errors, the local terminal or Cloud Run logs for `/api/chat`, and GitHub Actions for deployment errors. Redact keys, chat contents, and dataset rows before sharing logs.

| Symptom | Check and recovery |
| --- | --- |
| Local `/` gives 404 or redirects to `/BASE_PATH` | Start with `DEPLOY_TARGET=cloudrun npm run dev`. Unset target defaults to static configuration. |
| Port 3000 already in use | Stop the earlier server, or pass `--port 3001`. A new port has separate browser storage. |
| Local env changes have no effect | Restart dev server; check shell overrides. Public settings require a production rebuild, not merely a container restart. |
| API picker empty / requests to `undefined/games` | Set Files API base URL, restart/rebuild, inspect `/games` response and CORS. The URL must be absolute and must not include `/games`. |
| curl works but browser import fails | Check CORS and HTTPS mixed-content errors; the browser calls the API directly. |
| Assistant panel absent | Public build-time flag must be exactly `true`; rebuild. Static hosting cannot provide chat. |
| Chat returns 503 | Inspect JSON `reason`: `flag_off`, `invalid_provider`, or `missing_config`. Check both flags and server-only provider configuration. |
| Chat fails after configuration validation | Check key/model access, provider connectivity, tool support, server logs, and API manifest access. Configuration validation is not a connectivity test. |
| Ollama works on host, not in Docker | `127.0.0.1` inside the container refers to the container. Configure a host/service address reachable from that runtime. |
| TSV upload fails | Keep the documented underscore filename format and tab-separated header; use the synthetic fixture to isolate file/schema problems. |
| Numeric feature offered as categorical | Check the first row's value and column type; inference for non-graph data uses the first row. |
| Chart missing or blank | Verify dataset exists, correct feature/chart selected, filters leave rows, and chart supports that dataset level. A graph needs valid `nodes`, `links`, `encodings`; Sankey cannot show cycles or old job-graph-only data. |
| Saved dashboard missing on another URL/device | Browser storage is origin-specific, not server-synced. Export JSON on the original origin and import it on the new one. |
| Missing dataset after legacy JSON import | Old layout-only exports do not contain data. Reimport the dataset, or use a version-2 export containing referenced datasets. |
| Browser persistence fails | Check IndexedDB/localStorage availability, quota, private browsing, and console errors. Export work before clearing storage. |
| Clipboard image copy unavailable | Use a supported browser on HTTPS or localhost and allow clipboard access; use PNG download as fallback. |
| Next.js build reports missing intermediate files | Stop dev/build processes in the checkout, then run one target at a time. Do not build static and standalone concurrently. |
| Lint fails while builds pass | Known lint debt is non-blocking in CI; builds intentionally skip lint. Review failures against baseline rather than assuming tests covered them. |
| Cloud Run auth/push/deploy fails | Check WIF repository/environment restrictions, deployer permissions, Artifact Registry location, and runtime identity. |
| New Cloud Run API URL is ignored | Rebuild with the public build argument; runtime env alone does not replace the browser bundle. |
| Lab assets or API fail at subpath | Inspect generated config/API URL, base path, and root-relative assets; check the lab config action and deployment workflow inputs. |

## Recover browser state

First export each important dashboard, and verify an import in a separate browser profile. Prefer that clean profile for diagnosis; it avoids deleting working data. If a reset is necessary, close other tabs on the same origin, use browser developer tools to remove the `ogd-layout-store` localStorage entry and the `ogd-data-store` IndexedDB database, then reload and restore exported JSON. This deletes local saved work and is not an API cache refresh operation.

There is no implemented TTL refresh service. A previously imported dataset can remain in browser storage; to obtain fresh data, export work first, remove/reimport the affected dataset through the UI, and verify chart references and filters afterward.

## Escalation information

Provide a minimal reproduction with the synthetic TSV where possible, plus commit/revision, target (`static` or `cloudrun`), browser and Node versions, failing request path/status, and relevant redacted log lines. For API schema/network issues contact the recorded Files API owner; for WIF/IAM/VPN/SSH contact the recorded infrastructure owner. Keep those contacts in the team’s internal ownership directory.
