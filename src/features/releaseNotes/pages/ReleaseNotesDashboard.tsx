import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ColDef, GridReadyEvent, RowClickedEvent, GridApi } from 'ag-grid-community';
import { AppSectionHeader, AppGrid, AppStatusChip, AppGridToolbar, AppGridActionsMenu, AppDeleteConfirmationModal } from '@/components';
import { useReleaseNotes } from '../hooks/useReleaseNotes';
import { useGridPersistence } from '@/hooks/useGridPersistence';
import { FiltersPanel } from '../components/FiltersPanel';
import { ColumnsPanel } from '../components/ColumnsPanel';
import { ReleaseEditorModal } from '../components/ReleaseEditorModal';
import { ReleaseViewerModal } from '../components/ReleaseViewerModal';
import { ReleaseNote } from '../types';
import { generateNextVersion } from '../utils/versioning';

import { PageConfig, defaultConfig } from '../types/config';
import { ConfigVisualizer } from '../components/ConfigVisualizer';
import { DeveloperDocs } from '../components/DeveloperDocs';
import { CommandPalette } from '../components/CommandPalette';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface ReleaseNotesDashboardProps {
  config?: PageConfig;
}

/**
 * Enterprise Release Notes Dashboard
 * Features localized persistence, advanced filtering, and high-density grid.
 */
export const ReleaseNotesDashboard: React.FC<ReleaseNotesDashboardProps> = ({ 
  config = defaultConfig 
}) => {
  const navigate = useNavigate();
  const { version: routeVersion } = useParams<{ version: string }>();
  const { notes, loading, addNote, updateNote, deleteNote } = useReleaseNotes();
  const { restoreState, saveState, resetState } = useGridPersistence(`release_notes_grid_${config.ui.compactDensity ? 'compact' : 'standard'}`);

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Modals state
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => config.features.commandPalette && setPaletteOpen(true),
    'cmd+n': () => handleAdd(),
    'slash': () => {
      const searchInput = document.querySelector('input[placeholder="Search releases..."]') as HTMLInputElement;
      searchInput?.focus();
    },
    'f': () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  });

  // Handle route-driven viewer
  useEffect(() => {
    if (routeVersion && notes.length > 0) {
      const note = notes.find(n => n.version === routeVersion);
      if (note) {
        setSelectedNote(note);
        setViewerOpen(true);
      }
    }
  }, [routeVersion, notes]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    restoreState(params.api);
  };

  const onFilterChanged = useCallback(() => {
    if (gridApi) saveState(gridApi);
  }, [gridApi, saveState]);

  const onSortChanged = useCallback(() => {
    if (gridApi) saveState(gridApi);
  }, [gridApi, saveState]);

  const onColumnChanged = useCallback(() => {
    if (gridApi) saveState(gridApi);
  }, [gridApi, saveState]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    gridApi?.setGridOption('quickFilterText', value);
  }, [gridApi]);

  const handleReset = useCallback(() => {
    if (gridApi) {
      resetState(gridApi);
      setSearchText('');
      gridApi.setGridOption('quickFilterText', '');
    }
  }, [gridApi, resetState]);

  const onCellClicked = useCallback((event: any) => {
    // Only trigger modal if clicking the version column
    if (event.colDef?.field === 'version' && event.data) {
      navigate(`/release-notes/${event.data.version}`);
    }
  }, [navigate]);

  const handleAdd = useCallback(() => {
    setSelectedNote(null);
    setEditorOpen(true);
  }, []);

  const handleEdit = useCallback((note: ReleaseNote) => {
    setSelectedNote(note);
    setEditorOpen(true);
  }, []);

  const handleDuplicate = useCallback((note: ReleaseNote) => {
    const existingVersions = notes.map(n => n.version);
    const nextVersion = generateNextVersion(existingVersions);
    const duplicated: ReleaseNote = {
      ...note,
      id: crypto.randomUUID(),
      version: nextVersion,
      title: `${note.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addNote(duplicated);
  }, [notes, addNote]);

  const handleSaveNote = useCallback((note: ReleaseNote) => {
    if (notes.find(n => n.id === note.id)) {
      updateNote(note);
    } else {
      addNote(note);
    }
  }, [notes, updateNote, addNote]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      deleteNote(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, deleteNote]);

  const columnDefs = useMemo<ColDef<ReleaseNote>[]>(() => [
    { 
      field: 'version', 
      headerName: 'Version', 
      width: 120, 
      pinned: 'left',
      cellStyle: { 
        fontWeight: 600, 
        color: '#2563eb', 
        cursor: 'pointer',
        textDecoration: 'none',
      },
      // Subtle hover effect handled via AG Grid cellClass or cellStyle
      cellClass: 'clickable-version-cell'
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'audience', 
      headerName: 'Audience', 
      width: 130,
    },
    { 
      field: 'releaseType', 
      headerName: 'Release Type', 
      width: 150,
      cellRenderer: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      cellRenderer: (params: any) => {
        const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
          'Published': 'success',
          'Draft': 'warning',
          'Internal': 'info',
          'Deprecated': 'error'
        };
        return <AppStatusChip status={statusMap[params.value] || 'neutral'} label={params.value} />;
      }
    },
    { 
      headerName: 'Actions',
      width: config.features.sharing ? 100 : 80,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => (
        <AppGridActionsMenu 
          onView={() => navigate(`/release-notes/${params.data.version}`)}
          onEdit={() => handleEdit(params.data)}
          onDelete={() => config.features.deleteRelease && setDeleteId(params.data.id)}
        />
      )
    }
  ], [notes, navigate, addNote, config.features]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppSectionHeader 
        title="Release Repository" 
        subtitle="Manage, track, and publish versioned release documentation across the enterprise."
        noDivider
      />
      
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2 }}>
          <AppGridToolbar 
            searchPlaceholder="Search releases..."
            onSearchChange={handleSearch}
            onFiltersClick={() => setShowFilters(true)}
            onColumnsClick={() => setShowColumns(true)}
            onResetClick={handleReset}
            onAddClick={handleAdd}
            addLabel="Create Release"
            onDocsClick={config.ui.showDocs ? () => setShowDocs(true) : undefined}
            onConfigClick={config.ui.showConfig ? () => setShowConfig(true) : undefined}
            totalCount={notes.filter(n => n.title.toLowerCase().includes(searchText.toLowerCase())).length}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <AppGrid 
              height="100%"
              rowData={notes}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onFilterChanged={onFilterChanged}
              onSortChanged={onSortChanged}
              onColumnVisible={onColumnChanged}
              onColumnMoved={onColumnChanged}
              onColumnResized={onColumnChanged}
              onCellClicked={onCellClicked}
              loading={loading}
              overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading Releases...</span>'}
              overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No releases found.</span>'}
              rowHeight={config.grid.rowHeight}
              headerHeight={config.grid.headerHeight}
            />
          </Box>
        </Paper>

        <ConfigVisualizer config={config} open={showConfig} onClose={() => setShowConfig(false)} />
        <DeveloperDocs open={showDocs} onClose={() => setShowDocs(false)} />
      </Box>

      {config.features.commandPalette && (
        <CommandPalette 
          open={paletteOpen} 
          onClose={() => setPaletteOpen(false)} 
          onAction={(a) => a === 'new' && handleAdd()}
        />
      )}

      <FiltersPanel open={showFilters} onClose={() => setShowFilters(false)} />
      <ColumnsPanel open={showColumns} onClose={() => setShowColumns(false)} />
      
      <ReleaseEditorModal 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSave={handleSaveNote}
        existingNotes={notes}
        initialNote={selectedNote}
      />

      <ReleaseViewerModal 
        open={viewerOpen} 
        onClose={() => {
          setViewerOpen(false);
          setSelectedNote(null);
          navigate('/release-notes');
        }}
        note={selectedNote}
      />

      <AppDeleteConfirmationModal 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleConfirmDelete}
        title={notes.find(n => n.id === deleteId)?.title || ''}
      />
    </Box>
  );
};
