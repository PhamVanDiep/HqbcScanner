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
