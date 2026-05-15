import { useCallback } from 'react';
import { persistence } from '@/services/persistence';
import { GridApi, ColumnState } from 'ag-grid-community';

export const useGridPersistence = (gridId: string) => {
  const saveState = useCallback((gridApi: GridApi) => {
    if (!gridApi) return;
    
    const columnState = gridApi.getColumnState();
    const filterModel = gridApi.getFilterModel();
    
    persistence.set(`${gridId}_column_state`, columnState);
    persistence.set(`${gridId}_filter_model`, filterModel);
  }, [gridId]);

  const restoreState = useCallback((gridApi: GridApi) => {
    if (!gridApi) return;
    
    try {
      const columnState = persistence.get<ColumnState[] | null>(`${gridId}_column_state`, null);
      const filterModel = persistence.get<any | null>(`${gridId}_filter_model`, null);
      
      if (columnState && Array.isArray(columnState)) {
        gridApi.applyColumnState({ state: columnState, applyOrder: true });
      }
      
      if (filterModel) {
        gridApi.setFilterModel(filterModel);
      }
    } catch (error) {
      console.warn('Failed to restore grid state:', error);
      // Fallback: clear corrupted state
      persistence.remove(`${gridId}_column_state`);
      persistence.remove(`${gridId}_filter_model`);
    }
  }, [gridId]);

  const resetState = useCallback((gridApi: GridApi) => {
    if (!gridApi) return;
    
    gridApi.resetColumnState();
    gridApi.setFilterModel(null);
    
    persistence.remove(`${gridId}_column_state`);
    persistence.remove(`${gridId}_filter_model`);
  }, [gridId]);

  return { saveState, restoreState, resetState };
};
