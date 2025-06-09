import { useState, useCallback, useMemo } from 'react';
import { useApi } from '@/lib/hooks/use-api';
import { tablesService } from '../services/tables.service';
import { 
  Table, 
  Payment, 
  CreateTableData, 
  UpdateTableData,
  CreateReservationData,
  UpdateReservationData,
  TableStatus
} from '@/lib/types';

// Basic tables hook
export function useTables() {
  return useApi(
    () => tablesService.getTables(),
    {
      immediate: true,
    }
  );
}

// Single table hook
export function useTable(tableId: string) {
  return useApi(
    () => tablesService.getTable(tableId),
    {
      immediate: !!tableId,
    }
  );
}

// Table CRUD operations hook
export function useTableOperations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createTable = useCallback(async (tableData: CreateTableData) => {
    setIsCreating(true);
    try {
      const result = await tablesService.createTable(tableData);
      return result;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTable = useCallback(async (tableId: string, updates: UpdateTableData) => {
    setIsUpdating(true);
    try {
      const result = await tablesService.updateTable(tableId, updates);
      return result;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteTable = useCallback(async (tableId: string) => {
    setIsDeleting(true);
    try {
      await tablesService.deleteTable(tableId);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    createTable,
    updateTable,
    deleteTable,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Table status management hook
export function useTableStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingTableId, setUpdatingTableId] = useState<string | null>(null);

  const updateTableStatus = useCallback(async (tableId: string, status: Table['status']) => {
    setIsUpdating(true);
    setUpdatingTableId(tableId);
    try {
      const result = await tablesService.updateTableStatus(tableId, status);
      return result;
    } finally {
      setIsUpdating(false);
      setUpdatingTableId(null);
    }
  }, []);

  const seatCustomers = useCallback(async (tableId: string, customerCount: number) => {
    setIsUpdating(true);
    setUpdatingTableId(tableId);
    try {
      const result = await tablesService.seatCustomers(tableId, customerCount);
      return result;
    } finally {
      setIsUpdating(false);
      setUpdatingTableId(null);
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (tableIds: string[], status: Table['status']) => {
    setIsUpdating(true);
    try {
      const result = await tablesService.bulkUpdateTableStatus(tableIds, status);
      return result;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateTableStatus,
    seatCustomers,
    bulkUpdateStatus,
    isUpdating,
    updatingTableId,
  };
}

// QR Code generation hook
export function useQRCodeGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingTableId, setGeneratingTableId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const generateQRCode = useCallback(async (tableId: string) => {
    setIsGenerating(true);
    setGeneratingTableId(tableId);
    try {
      const result = await tablesService.generateQRCode(tableId);
      return result;
    } finally {
      setIsGenerating(false);
      setGeneratingTableId(null);
    }
  }, []);

  const downloadQRCode = useCallback(async (tableId: string, tableName: string) => {
    setIsDownloading(true);
    try {
      const blob = await tablesService.downloadQRCode(tableId);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `table-${tableName}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    generateQRCode,
    downloadQRCode,
    isGenerating,
    generatingTableId,
    isDownloading,
  };
}

// Reservations hook
export function useReservations(tableId?: string) {
  return useApi(
    () => tablesService.getReservations(tableId),
    {
      immediate: true,
    }
  );
}

// Reservation operations hook
export function useReservationOperations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const createReservation = useCallback(async (reservationData: CreateReservationData) => {
    setIsCreating(true);
    try {
      const result = await tablesService.createReservation(reservationData);
      return result;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateReservation = useCallback(async (reservationId: string, updates: UpdateReservationData) => {
    setIsUpdating(true);
    try {
      const result = await tablesService.updateReservation(reservationId, updates);
      return result;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const cancelReservation = useCallback(async (reservationId: string) => {
    setIsCancelling(true);
    try {
      await tablesService.cancelReservation(reservationId);
    } finally {
      setIsCancelling(false);
    }
  }, []);

  return {
    createReservation,
    updateReservation,
    cancelReservation,
    isCreating,
    isUpdating,
    isCancelling,
  };
}

// Payments hook
export function usePayments(tableId?: string) {
  return useApi(
    () => tablesService.getPayments(tableId),
    {
      immediate: true,
    }
  );
}

// Payment operations hook
export function usePaymentOperations() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = useCallback(async (orderId: string, paymentData: Partial<Payment>) => {
    setIsProcessing(true);
    try {
      const result = await tablesService.processPayment(orderId, paymentData);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processPayment,
    isProcessing,
  };
}

// Table analytics hook
export function useTableAnalytics(tableId?: string) {
  return useApi(
    () => tablesService.getTableAnalytics(tableId),
    {
      immediate: true,
    }
  );
}

// Table orders hook
export function useTableOrders(tableId: string) {
  return useApi(
    () => tablesService.getTableOrders(tableId),
    {
      immediate: !!tableId,
    }
  );
}

// Table search hook
export function useTableSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Table[]>([]);

  const searchTables = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await tablesService.searchTables(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchTables,
    clearSearch,
    searchResults,
    isSearching,
  };
}

// Table filtering hook
export function useTableFilters(tables: Table[]) {
  const [statusFilter, setStatusFilter] = useState<TableStatus>('all');
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      // Status filter
      if (statusFilter !== 'all' && table.status !== statusFilter) {
        return false;
      }

      // Capacity filter
      if (capacityFilter && table.capacity < capacityFilter) {
        return false;
      }

      // Location filter
      if (locationFilter !== 'all' && table.location !== locationFilter) {
        return false;
      }

      return true;
    });
  }, [tables, statusFilter, capacityFilter, locationFilter]);

  const availableLocations = useMemo(() => {
    const locations = new Set(tables.map(t => t.location).filter(Boolean));
    return Array.from(locations);
  }, [tables]);

  return {
    filteredTables,
    statusFilter,
    setStatusFilter,
    capacityFilter,
    setCapacityFilter,
    locationFilter,
    setLocationFilter,
    availableLocations,
  };
}

// Main comprehensive table management hook
export function useTablesManagement() {
  const tablesApi = useTables();
  const { generateQRCode, downloadQRCode, isGenerating, generatingTableId, isDownloading } = useQRCodeGeneration();
  const { updateTableStatus, seatCustomers, isUpdating, updatingTableId } = useTableStatus();
  const { createTable, updateTable, deleteTable, isCreating, isUpdating: isCrudUpdating, isDeleting } = useTableOperations();
  
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const handleGenerateQR = useCallback(async (tableId: string) => {
    try {
      setSelectedTable(tableId);
      const data = await generateQRCode(tableId);
      setQrCodeData(data);
      return data;
    } catch (error) {
      setSelectedTable(null);
      throw error;
    }
  }, [generateQRCode]);

  const handleDownload = useCallback(async () => {
    if (!selectedTable || !tablesApi.data) return;
    
    const table = tablesApi.data.find((t: Table) => t.id === selectedTable);
    if (!table) return;

    try {
      await downloadQRCode(selectedTable, table.number);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  }, [selectedTable, tablesApi.data, downloadQRCode]);

  const handlePrint = useCallback(() => {
    if (!qrCodeData || !selectedTable || !tablesApi.data) return;
    
    const table = tablesApi.data.find((t: Table) => t.id === selectedTable);
    if (!table) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - Table ${table.number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: white;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
              border: 2px solid #16a34a;
              border-radius: 12px;
              background: white;
            }
            .restaurant-name {
              font-size: 24px;
              font-weight: bold;
              color: #16a34a;
              margin-bottom: 10px;
            }
            .table-name {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
            }
            .qr-placeholder {
              width: 200px;
              height: 200px;
              border: 2px dashed #16a34a;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #16a34a;
            }
            .instructions {
              font-size: 14px;
              color: #666;
              max-width: 250px;
              margin: 0 auto;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="restaurant-name">Scan & Dine</div>
            <div class="table-name">Table ${table.number} • ${table.capacity} Seats</div>
            <div class="qr-placeholder">QR Code Here</div>
            <div class="instructions">
              Scan this QR code with your phone camera to view our menu and place your order directly from your table.
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }, [qrCodeData, selectedTable, tablesApi.data]);

  const handleStatusUpdate = useCallback(async (tableId: string, status: Table['status']) => {
    try {
      await updateTableStatus(tableId, status);
      await tablesApi.execute();
    } catch (error) {
      console.error('Failed to update table status:', error);
      throw error;
    }
  }, [updateTableStatus, tablesApi]);

  const handleSeatCustomers = useCallback(async (tableId: string, customerCount: number) => {
    try {
      await seatCustomers(tableId, customerCount);
      await tablesApi.execute();
    } catch (error) {
      console.error('Failed to seat customers:', error);
      throw error;
    }
  }, [seatCustomers, tablesApi]);

  const handleCreateTable = useCallback(async (tableData: CreateTableData) => {
    try {
      const newTable = await createTable(tableData);
      await tablesApi.execute();
      return newTable;
    } catch (error) {
      console.error('Failed to create table:', error);
      throw error;
    }
  }, [createTable, tablesApi]);

  const handleUpdateTable = useCallback(async (tableId: string, updates: UpdateTableData) => {
    try {
      const updatedTable = await updateTable(tableId, updates);
      await tablesApi.execute();
      return updatedTable;
    } catch (error) {
      console.error('Failed to update table:', error);
      throw error;
    }
  }, [updateTable, tablesApi]);

  const handleDeleteTable = useCallback(async (tableId: string) => {
    try {
      await deleteTable(tableId);
      await tablesApi.execute();
    } catch (error) {
      console.error('Failed to delete table:', error);
      throw error;
    }
  }, [deleteTable, tablesApi]);

  return {
    // Data
    tables: tablesApi.data || [],
    isLoading: tablesApi.isLoading,
    error: tablesApi.error,
    selectedTable,
    qrCodeData,
    
    // QR Code operations
    handleGenerateQR,
    handleDownload,
    handlePrint,
    isGenerating,
    generatingTableId,
    isDownloading,
    
    // Status operations
    handleStatusUpdate,
    handleSeatCustomers,
    isUpdating,
    updatingTableId,
    
    // CRUD operations
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
    isCreating,
    isCrudUpdating,
    isDeleting,
    
    // Utility
    refetch: tablesApi.execute,
    setSelectedTable,
    setQrCodeData,
  };
}

// Backward compatibility alias
export const useQRCodesManagement = useTablesManagement; 