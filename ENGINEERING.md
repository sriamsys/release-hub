# ReleaseHub Engineering Documentation

## Architecture Overview
ReleaseHub is built as a high-density, configuration-driven enterprise frontend platform. It utilizes a modular feature-based architecture.

### Tech Stack
- **Framework**: React 18 + Vite
- **UI Components**: Material UI (MUI) v5
- **Data Grid**: AG Grid v31 (Enterprise Ready)
- **Rich Text**: Tiptap Editor
- **Animations**: Motion (framer-motion)
- **Routing**: React Router v6

## Feature Architecture
The application is partitioned by features (located in `src/features`). Each feature contains its own:
- `components/`: Feature-specific UI
- `hooks/`: Business logic and state management
- `pages/`: Route entry points
- `services/`: API or persistence abstraction
- `types/`: Domain models

## Persistence Strategy
ReleaseHub uses a hardened `localStorage` persistence layer found in `src/services/persistence.ts`.
- **Versioning**: All storage payloads include a `_version` tag to handle schema migrations.
- **Payload Wrapping**: Data is wrapped with metadata (`_updatedAt`) to track record stale-ness.
- **Diagnostic Utilities**: Built-in methods to inspect and clear application state in case of corruption.
- **Recovery**: Integrated `ErrorBoundary` allowing users to clear possibly corrupted local data and reset the app.

## AG Grid Integration
The dashboard uses a standardized `AppGrid` wrapper.
- **Centralized API Ownership**: The `gridApi` is managed at the page level and provided to toolbars/panels.
- **Persistence**: `useGridPersistence` hook handles column sorting, filtering, and visibility persistence.
- **Virtualization**: Standardized row and header heights via enterprise configuration.
- **Theming**: Custom CSS injection to match the enterprise design system (compact density, slate palette).

## Modal & Navigation System
- **Route Synchronization**: View modes (e.g., `/release-notes/:version`) are deep-linkable. Opening a release updates the URL; refreshing the page restores the viewer state.
- **Focus Management**: `AppFullscreenDialog` and `AppSlideOver` implement focus trapping and escape handling.
- **Stacking**: Modals are layered using MUI's portal system ensuring z-index consistency.

## Configuration Engine
The app allows dynamically switching between configurations (Basic, Advanced, Enterprise).
- **PageConfig**: A shared type define features toggles (e.g., `commandPalette`, `sharing`) and UI density settings.
- **Density**: Row and header heights are driven by the active configuration.

## Performance Considerations
- **Memoization**: All grid callbacks and heavy sub-components are wrapped in `useCallback` or `useMemo`.
- **Stable References**: `columnDefs` are stabilized to prevent AG Grid layout recalculations.
- **Lazy Loading**: (Roadmap) Large components like the Rich Text Editor are targets for code-splitting.

## Global Consistency
- **Buttons**: Use the `AppButton` wrapper for standardized enterprise styles.
- **Status**: `AppStatusChip` provides a unified semantic color mapping across the grid and viewer.
- **Spacing**: MUI Theme tokens are restricted to 4px increments for a rhythmic layout.
