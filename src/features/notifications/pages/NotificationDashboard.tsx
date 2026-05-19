import React, { useState, useMemo, useCallback } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AppSectionHeader, AppGrid, AppStatusChip, AppGridToolbar, AppDeleteConfirmationModal, AppGridActionsMenu } from '@/components';
import { useNotifications } from '../hooks/useNotifications';
import { useGridPersistence } from '@/hooks/useGridPersistence';
import { NotificationEditorModal } from '../components/NotificationEditorModal';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';

export const NotificationDashboard: React.FC = () => {
  const { notifications: activeNotifications, dismiss } = useNotifications();
  // We need ALL notifications for the management grid, not just active ones
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { restoreState, saveState, resetState } = useGridPersistence('notifications_management_grid');

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Modals state
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    const list = notificationService.getNotifications();
    setAllNotifications(list);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    restoreState(params.api);
  };

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

  const handleAdd = useCallback(() => {
    setSelectedNotification(null);
    setEditorOpen(true);
  }, []);

  const handleEdit = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setEditorOpen(true);
  }, []);

  const handleSave = useCallback((notification: Notification) => {
    if (allNotifications.find(n => n.id === notification.id)) {
      notificationService.updateNotification(notification);
    } else {
      notificationService.addNotification(notification);
    }
    loadData();
  }, [allNotifications, loadData]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      notificationService.deleteNotification(deleteId);
      setDeleteId(null);
      loadData();
    }
  }, [deleteId, loadData]);

  const columnDefs = useMemo<ColDef<Notification>[]>(() => [
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1, 
      minWidth: 200,
      cellStyle: { fontWeight: 600 }
    },
    { 
      field: 'audience', 
      headerName: 'Audience', 
      width: 150,
      cellRenderer: (params: any) => params.value.join(', ')
    },
    { 
      field: 'startDateTime', 
      headerName: 'Start DateTime', 
      width: 180,
      cellRenderer: (params: any) => new Date(params.value).toLocaleString()
    },
    { 
      field: 'validUntil', 
      headerName: 'Valid Until', 
      width: 180,
      cellRenderer: (params: any) => new Date(params.value).toLocaleString()
    },
    { 
      field: 'type', 
      headerName: 'Severity', 
      width: 120,
      cellRenderer: (params: any) => {
        const statusMap: Record<string, 'info' | 'warning' | 'error' | 'success' | 'neutral'> = {
          'info': 'info',
          'warning': 'warning',
          'error': 'error',
          'outage': 'error',
          'success': 'success'
        };
        return <AppStatusChip status={statusMap[params.value] || 'neutral'} label={params.value.toUpperCase()} />;
      }
    },
    { 
      field: 'repeatEnabled', 
      headerName: 'Repeat Type', 
      width: 130,
      cellRenderer: (params: any) => params.value ? `Every ${params.data.repeatIntervalMinutes}m` : 'None'
    },
    { 
      field: 'active', 
      headerName: 'Status', 
      width: 110,
      cellRenderer: (params: any) => (
        <AppStatusChip status={params.value ? 'success' : 'neutral'} label={params.value ? 'Active' : 'Inactive'} />
      )
    },
    { 
      headerName: 'Actions',
      width: 80,
      pinned: 'right',
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params: any) => (
        <AppGridActionsMenu 
          onEdit={() => handleEdit(params.data)}
          onDelete={() => setDeleteId(params.data.id)}
        />
      )
    }
  ], [handleEdit]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppSectionHeader 
        title="Notification Management" 
        subtitle="Configure system-wide alerts, maintenance banners, and audience-targeted announcements."
        noDivider
      />
      
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2 }}>
          <AppGridToolbar 
            searchPlaceholder="Search notifications..."
            onSearchChange={handleSearch}
            onResetClick={handleReset}
            onAddClick={handleAdd}
            addLabel="Create Notification"
            totalCount={allNotifications.length}
            countLabel="Entries"
            onFiltersClick={() => {}} 
            onColumnsClick={() => {}} 
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <AppGrid 
              height="100%"
              rowData={allNotifications}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onFilterChanged={() => gridApi && saveState(gridApi)}
              onSortChanged={() => gridApi && saveState(gridApi)}
              onColumnVisible={() => gridApi && saveState(gridApi)}
              onColumnMoved={() => gridApi && saveState(gridApi)}
              onColumnResized={() => gridApi && saveState(gridApi)}
              loading={loading}
              overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading Notifications...</span>'}
              overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No notifications found.</span>'}
            />
          </Box>
        </Paper>
      </Box>

      <NotificationEditorModal 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSave={handleSave}
        initialNotification={selectedNotification}
      />

      <AppDeleteConfirmationModal 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleConfirmDelete}
        title={allNotifications.find(n => n.id === deleteId)?.title || ''}
      />
    </Box>
  );
};
