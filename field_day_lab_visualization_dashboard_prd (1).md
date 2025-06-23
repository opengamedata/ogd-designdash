## Architecture Diagram

Below is a standalone Mermaid diagram illustrating the architecture:

```mermaid
flowchart LR
  subgraph Frontend
    A[Next.js App]
    A --> B[Pages & Components]
    B --> C[react-grid-layout]
    B --> D[D3.js Charts]
    A --> E[Zustand Store]
  end
  subgraph Data_Layer
    E --> F[Adapters]
    F -->|TSV| G[TSV Adapter]
    F -->|API| H[API Adapter]
    H --> I[API Service (Axios)]
    I --> J[LocalStorage Cache]
    G --> J
  end
  subgraph Server
    K[/api routes/] --> H
  end
```

## Technical Documentation

- **Framework & SSR:** Next.js with React and TypeScript for file-based routing, server-side rendering (SSR), and optimized performance.
- **State Management:** Zustand with middleware (e.g., redux-devtools) to manage layout, data-layer, and cache state in a lightweight, hook-based store.
- **Visualization Library:** D3.js for fully customizable, low-level charting capabilities, wrapped in modular React components.
- **Grid Layout:** react-grid-layout for responsive, draggable, and resizable visualization panels, with layout persistence.
- **Data Abstraction Layer:** Adapter pattern modules in a `/adapters` directory to normalize TSV and API responses into a shared `FeatureSet` interface.
- **Data Fetching & Caching:** Axios (or built‑in fetch) wrapped in a custom service that writes to LocalStorage with TTL metadata; cache invalidation via manual refresh or expiration.
- **Testing:** Unit tests with Jest & React Testing Library; integration tests with Cypress for end-to-end flows (file upload → parse → render).
- **Linting & Formatting:** ESLint with Airbnb style rules and Prettier for code consistency.

