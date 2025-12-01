export interface QRCodeData {
  DeviceID: string;
  type?: string;
}

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'date';

export interface SelectOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  defaultValue: string | number;
  options?: SelectOption[];
}

export interface DeviceFieldsResponse {
  success: boolean;
  data?: {
    deviceId: string;
    deviceName: string;
    fields: Field[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface SaveDeviceRequest {
  deviceId: string;
  data: Record<string, any>;
  scannedAt: string;
  scannedBy?: string;
}

export interface SaveDeviceResponse {
  success: boolean;
  data?: {
    id: string;
    deviceId: string;
    message: string;
    savedAt: string;
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// User & Authentication Types
export interface User {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend user info structure
export interface BackendUserInfo {
  userid?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
}

// Backend auth response data structure
export interface AuthResponseData {
  info?: BackendUserInfo;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

export interface AuthResponse {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  useBiometric?: boolean;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
  userid?: string;
  tel?: string;
}

// Customer Types
export interface Customer {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Supplier Types
export interface Supplier {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  contactPerson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  supplierName?: string;
}

// Category Types
export interface Category {
  id?: string;
  name?: string;
  description?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface Product {
  id?: string;
  name?: string;
  barcode?: string;
  categoryId?: string;
  category?: Category;
  description?: string;
  unit?: string; // đơn vị tính
  price?: number; // giá bán
  costPrice?: number; // giá vốn
  stock?: number; // tồn kho
  minStock?: number; // tồn kho tối thiểu
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Invoice Types (Hóa đơn nhập hàng)
export interface Invoice {
  id?: string;
  invoiceNumber?: string;
  supplierId?: string;
  supplier?: Supplier;
  totalAmount?: number;
  paidAmount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  items?: InvoiceItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  invoiceDate?: any;
  supplierName?: string;
}

export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  productId?: string;
  product?: Product;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  price?: number;
}

// Retail Sales Types (Bán lẻ)
export interface RetailSale {
  id?: string;
  saleNumber?: string;
  customerId?: string;
  customer?: Customer;
  totalAmount?: number;
  paidAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  items?: RetailSaleItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  saleDate?: any;
  customerName?: string;
}

export interface RetailSaleItem {
  id?: string;
  retailSaleId?: string;
  productId?: string;
  product?: Product;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

// Project Types
export interface Project {
  id?: string;
  projectNumber?: string;
  name?: string;
  customerId?: string;
  customer?: Customer;
  description?: string;
  status?: 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  paidAmount?: number;
  allocatedProducts?: ProjectAllocatedProduct[];
  returnedProducts?: ProjectReturnedProduct[];
  invoices?: ProjectInvoice[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectAllocatedProduct {
  id?: string;
  projectId?: string;
  productId?: string;
  product?: Product;
  quantity?: number;
  allocatedDate?: string;
  notes?: string;
}

export interface ProjectReturnedProduct {
  id?: string;
  projectId?: string;
  productId?: string;
  product?: Product;
  quantity?: number;
  returnedDate?: string;
  notes?: string;
}

export interface ProjectInvoice {
  id?: string;
  projectId?: string;
  invoiceNumber?: string;
  items?: ProjectInvoiceItem[];
  totalAmount?: number;
  paidAmount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectInvoiceItem {
  id?: string;
  invoiceId?: string;
  productId?: string;
  product?: Product;
  allocatedQuantity?: number;
  returnedQuantity?: number;
  finalQuantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

// Debt Types (Ghi nợ)
export interface Debt {
  id?: string;
  customerId?: string;
  customer?: Customer;
  type?: 'retail' | 'project';
  referenceId?: string; // ID của hóa đơn bán lẻ hoặc dự án
  totalAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  status?: 'pending' | 'partial' | 'paid';
  payments?: DebtPayment[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  customerName?: string;
}

export interface DebtPayment {
  id?: string;
  debtId?: string;
  amount?: number;
  paymentDate?: string;
  notes?: string;
}

// App Update Types
export interface AppVersion {
  version?: string;
  buildNumber?: number;
  downloadUrl?: string;
  releaseNotes?: string;
  isForceUpdate?: boolean;
  createdAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  code?: number;
  type?: string;
  message?: string;
  data?: T;
  timestamp?: string;
  count?: number;
  countPage?: number;
}

export interface PaginatedResponse<T> {
  data?: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
