# Using the dashboard

[Back to README](../README.md)

## Load data

Use the Data sidebar to import a player/session dataset from the API picker or upload an OGD TSV. API imports require the configuration described in [configuration](configuration.md). Datasets are shared by charts and dashboards within this browser origin.

TSV metadata is parsed from the filename, using this exact underscore-separated structure:

```text
GAME_YYYYMMDD_to_YYYYMMDD_VERSION_player-features.tsv
```

Use `session-features.tsv` for session data. Avoid extra underscores in the game or version segment because the parser splits positionally. Files must contain tab-separated columns with a header. Numeric cells are auto-typed by D3; most non-graph column types are inferred from the first row. A blank or textual first cell can therefore make an otherwise numeric column categorical. The upload control checks file type/extension, not the full schema.

[The synthetic example](examples/DEMO_20260101_to_20260131_demo_player-features.tsv) provides `PlayerID`, `Score`, `Duration`, and `Group` columns. It requires no API service.

Graph features are JSON objects or JSON strings with `nodes`, `links`, and `encodings`. For example:

```json
{"nodes":[{"id":"a"},{"id":"b"}],"links":[{"source":"a","target":"b","link_count":2}],"encodings":{"linkWidth":"link_count"}}
```

Force Graph and Sankey aggregate the chosen feature across filtered rows. Matching directed links have their weights summed; node metadata comes from the first occurrence. Sankey rejects cycles. Legacy population files and explicit population links remain supported, but population is no longer offered by the API picker or assistant's dataset-import tool. Old job-graph-only Sankey layouts need a Graph feature; the old source mode was removed.

## Charts, filters, and layouts

1. Create or select a dashboard in Dashboards.
2. Use chart settings to choose a dataset and an available chart type, then Apply. Select features in the chart's controls.
3. Drag and resize panels. Customize a title if needed; automatically generated titles follow dataset changes.
4. Under a dataset, add filters or split it into derived datasets. Filters affect charts using that dataset. Check the displayed row counts before interpreting results.
5. For comparisons, select both datasets. Changing Dataset 1 preserves Dataset 2 unless it becomes the same dataset.

Available charts depend on feature level and columns. Player/session data supports descriptive statistics, bar charts, histograms, scatterplots, box plots, and dataset comparison; Graph columns add Force Graph and Sankey. Legacy population Job Graph requires its specific job fields. The existence of a chart component in source does not mean it is offered for every dataset.

Multi-select menus provide Select all (adds the current search results), Select none (clears selection), and Exclude selection (inverts selection across all options). Filters and Features sections can collapse independently.

## Save, back up, and share

Changes persist in the browser. There is no application account, shared server-side dashboard database, or cross-device synchronization.

- Layouts: localStorage key `ogd-layout-store`.
- Datasets and manifests: IndexedDB database `ogd-data-store`, object store `store`, key `ogd-data-store`.
- Storage is scoped by origin: `localhost`, `127.0.0.1`, different ports, staging, and production have separate state. Different URL paths on the same origin share storage keys.

Use **Export dashboard as JSON** on a dashboard row for a portable backup. The version-2 export includes that layout and the complete datasets referenced by its charts, not merely the visible filtered rows. Export each dashboard you need; unreferenced datasets are not included. Treat an export as a data file when sharing it.

Use **Import Dashboard JSON** beside New Dashboard to restore it. Imports merge records by ID and can overwrite matching layouts/datasets. Export current work first if you need to preserve it. Legacy layout-only JSON may require reimporting the original datasets separately. Import your export into a separate browser profile to verify recovery before clearing site storage.

Hover over a rendered chart for PNG download or clipboard copy. These capture a chart image, not an editable dashboard. Clipboard image support depends on the browser and secure context; use PNG download as the fallback.

## Dataset links

A link can load a dataset using query parameters:

```text
/?game=GAME_ID&year=2026&month=01&level=player
```

For lab deployments, put the query after the configured deployment path. `game`, a four-digit year, and a two-digit month are needed; omitted/invalid level defaults to player. A link fetches or reuses the dataset and wires an empty chart when available. It does not serialize your custom charts or filters; use dashboard JSON to share those.
