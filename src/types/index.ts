import { IQUser } from './IQUser';
import { ITsvhDatum } from './ITsvhDatum';

export interface QRCodeData {
  qrCode: string;
}

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'date';

export interface SelectOption {
  label: string;
  value: string;
}

// Backend auth response data structure
export interface AuthResponseData {
  info?: IQUser;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

export interface AuthResponse {
  user?: IQUser;
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

export interface Sort {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface Pageable {
  offset?: number;
  pageNumber?: number;
  pageSize?: number;
  paged?: boolean;
  sort?: Sort;
  unpaged?: boolean;
}

export interface Page<T> {
  content?: T[];
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  pageable?: Pageable;
  size?: number;
  sort?: Sort;
  totalElements?: number;
  totalPages?: number;
}

export interface TsvhPayload {
  data?: ITsvhDatum[];
}

export interface TsvhRequest {
  dtime?: any;
  maThietBis?: string[];
}

export * from './INhaMay';
export * from './IQUser';
export * from './IQUserNhaMayId';
export * from './IQUserNhaMay';
export * from './IQUserThietBiId';
export * from './IQUserThietBi';
export * from './IThietBi';
export * from './IThietBiThongSo';
export * from './IThongSo';
export * from './ITsvhDatumId';
export * from './ITsvhDatum';
