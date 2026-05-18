import React, { useState, useMemo, useCallback } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { ColDef, GridReadyEvent, GridApi, RowDragMoveEvent, RowDragEndEvent, RowDragLeaveEvent } from 'ag-grid-community';
import { FolderRounded, HelpOutlineRounded } from '@mui/icons-material';
import { AppSectionHeader, AppGrid, AppStatusChip, AppGridToolbar, AppDeleteConfirmationModal, AppGridActionsMenu } from '@/components';
import { useFaqs } from '../hooks/useFaqs';
import { useGridPersistence } from '@/hooks/useGridPersistence';
import { FaqEditorModal } from '../components/FaqEditorModal';
import { FaqEntry } from '../types';

export const FaqDashboard: React.FC = () => {
  const { faqs, loading, addFaq, updateFaq, deleteFaq, saveAllFaqs } = useFaqs();
  const { restoreState, saveState, resetState } = useGridPersistence('faqs_management_grid');

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Modals state
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ id: string, position: 'above' | 'below' | 'inside' } | null>(null);

  // Rebuild hierarchy for display
  const hierarchicalData = useMemo(() => {
    const result: (FaqEntry & { level: number })[] = [];
    
    const addChildren = (parentId: string | null, level: number) => {
      const children = faqs
        .filter(f => f.parentId === parentId)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      
      children.forEach(child => {
        result.push({ ...child, level });
        if (child.isGroup) {
          addChildren(child.id, level + 1);
        }
      });
    };

    addChildren(null, 0);
    
    // Add orphans (safety net for broken hierarchies)
    const orphans = faqs.filter(f => !result.find(r => r.id === f.id));
    orphans.forEach(o => result.push({ ...o, level: 0 }));

    return result;
  }, [faqs]);

  // Row Drag Logic
  const onRowDragMove = useCallback((event: RowDragMoveEvent) => {
    const overNode = event.overNode;
    if (!overNode) {
      setDropTarget(null);
      return;
    }

    const overData = overNode.data as FaqEntry;
    const mouseY = event.event.clientY;
    
    const rowId = overNode.id || overData.id;
    const rowElement = document.querySelector(`.ag-row[row-id="${rowId}"]`);
    
    if (!rowElement) return;

    const rect = rowElement.getBoundingClientRect();
    const relativeY = mouseY - rect.top;
    const threshold = rect.height / 3;

    if (overData.isGroup) {
      if (relativeY < threshold) {
        setDropTarget({ id: overData.id, position: 'above' });
      } else if (relativeY > threshold * 2) {
        setDropTarget({ id: overData.id, position: 'below' });
      } else {
        setDropTarget({ id: overData.id, position: 'inside' });
      }
    } else {
      if (relativeY < rect.height / 2) {
        setDropTarget({ id: overData.id, position: 'above' });
      } else {
        setDropTarget({ id: overData.id, position: 'below' });
      }
    }
  }, []);

  const onRowDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const onRowDragEnd = useCallback((event: RowDragEndEvent) => {
    const draggedNode = event.node;
    if (!dropTarget || draggedNode.data.id === dropTarget.id) {
      setDropTarget(null);
      return;
    }

    const draggedData = draggedNode.data as FaqEntry;
    const overData = faqs.find(f => f.id === dropTarget.id);

    if (!overData) {
      setDropTarget(null);
      return;
    }

    // Prevent circular reference
    const isDescendant = (potentialParentId: string, targetId: string): boolean => {
      let currentParentId: string | null = potentialParentId;
      while (currentParentId) {
        if (currentParentId === targetId) return true;
        const parent = faqs.find(f => f.id === currentParentId);
        currentParentId = parent?.parentId || null;
      }
      return false;
    };

    if (draggedData.isGroup && isDescendant(overData.id, draggedData.id)) {
      setDropTarget(null);
      return;
    }

    const newFaqs = [...faqs];
    const dragIdx = newFaqs.findIndex(f => f.id === draggedData.id);
    const draggedItem = { ...newFaqs[dragIdx] };

    if (dropTarget.position === 'inside') {
      draggedItem.parentId = overData.id;
      draggedItem.displayOrder = -1; // First in group
    } else {
      draggedItem.parentId = overData.parentId;
      draggedItem.displayOrder = dropTarget.position === 'above' 
        ? overData.displayOrder - 0.5 
        : overData.displayOrder + 0.5;
    }

    newFaqs[dragIdx] = draggedItem;

    // Global re-normalization
    // Filter by same parent and sort
    const finalSort = (unsorted: FaqEntry[]): FaqEntry[] => {
      const parentGroups: Record<string, FaqEntry[]> = {};
      unsorted.forEach(f => {
        const pid = f.parentId || 'root';
        if (!parentGroups[pid]) parentGroups[pid] = [];
        parentGroups[pid].push(f);
      });

      Object.keys(parentGroups).forEach(pid => {
        parentGroups[pid].sort((a, b) => a.displayOrder - b.displayOrder);
        parentGroups[pid] = parentGroups[pid].map((f, i) => ({ ...f, displayOrder: i }));
      });

      return Object.values(parentGroups).flat();
    };

    saveAllFaqs(finalSort(newFaqs));
    setDropTarget(null);
  }, [faqs, saveAllFaqs, dropTarget]);

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
    setSelectedFaq(null);
    setEditorOpen(true);
  }, []);

  const handleEdit = useCallback((faq: FaqEntry) => {
    setSelectedFaq(faq);
    setEditorOpen(true);
  }, []);

  const handleSaveFaq = useCallback((faq: FaqEntry) => {
    if (faqs.find(f => f.id === faq.id)) {
      updateFaq(faq);
    } else {
      addFaq(faq);
    }
  }, [faqs, updateFaq, addFaq]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      deleteFaq(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, deleteFaq]);

  const columnDefs = useMemo<ColDef<FaqEntry>[]>(() => [
    { 
      field: 'question', 
      headerName: 'Question', 
      flex: 1, 
      minWidth: 300,
      rowDrag: true,
      cellRenderer: (params: any) => {
        const data = params.data;
        const level = (data as any).level || 0;
        return (
          <Stack direction="row" alignItems="center" sx={{ pl: level * 3 }}>
            {data.isGroup ? (
              <FolderRounded sx={{ fontSize: 18, mr: 1, color: 'primary.main', opacity: 0.8 }} />
            ) : (
              <HelpOutlineRounded sx={{ fontSize: 18, mr: 1, color: level > 0 ? 'text.secondary' : 'text.disabled', opacity: 0.6 }} />
            )}
            <Typography variant="body2" sx={{ fontWeight: data.isGroup ? 700 : 500, color: data.isGroup ? 'text.primary' : 'text.secondary' }}>
              {data.question}
            </Typography>
          </Stack>
        );
      }
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150,
      cellRenderer: (params: any) => (
        <AppStatusChip status="info" label={params.value} />
      )
    },
    { 
      field: 'audience', 
      headerName: 'Audience', 
      width: 140 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      cellRenderer: (params: any) => {
        const statusMap: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          'Published': 'success',
          'Draft': 'warning',
          'Hidden': 'error'
        };
        return <AppStatusChip status={statusMap[params.value] || 'neutral'} label={params.value} />;
      }
    },
    { 
      field: 'featured', 
      headerName: 'Featured', 
      width: 100,
      cellRenderer: (params: any) => params.value ? 'Yes' : 'No'
    },
    { 
      field: 'createdBy', 
      headerName: 'Updated By', 
      width: 150 
    },
    { 
      field: 'updatedAt', 
      headerName: 'Updated Date', 
      width: 160,
      cellRenderer: (params: any) => new Date(params.value).toLocaleDateString()
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
        title="Knowledge Base Management" 
        subtitle="Create and organize frequently asked questions to empower your users and reduce support volume."
        noDivider
      />
      
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2 }}>
          <AppGridToolbar 
            searchPlaceholder="Search FAQs..."
            onSearchChange={handleSearch}
            onResetClick={handleReset}
            onAddClick={handleAdd}
            addLabel="Create FAQ"
            totalCount={faqs.length}
            countLabel="Entries"
            onFiltersClick={() => {}} 
            onColumnsClick={() => {}} 
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <AppGrid 
              height="100%"
              rowData={hierarchicalData}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              onRowDragMove={onRowDragMove}
              onRowDragLeave={onRowDragLeave}
              onRowDragEnd={onRowDragEnd}
              getRowClass={(params) => {
                if (dropTarget && dropTarget.id === params.data.id) {
                  return `drop-target-${dropTarget.position}`;
                }
                return undefined;
              }}
              onFilterChanged={() => gridApi && saveState(gridApi)}
              onSortChanged={() => gridApi && saveState(gridApi)}
              onColumnVisible={() => gridApi && saveState(gridApi)}
              onColumnMoved={() => gridApi && saveState(gridApi)}
              onColumnResized={() => gridApi && saveState(gridApi)}
              loading={loading}
              overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading FAQ Hub...</span>'}
              overlayNoRowsTemplate={'<span class="ag-overlay-loading-center">No FAQ entries found.</span>'}
            />
          </Box>
        </Paper>
      </Box>

      <FaqEditorModal 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSave={handleSaveFaq}
        initialFaq={selectedFaq}
        allFaqs={faqs}
      />

      <AppDeleteConfirmationModal 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleConfirmDelete}
        title={faqs.find(f => f.id === deleteId)?.question || ''}
      />
    </Box>
  );
};
