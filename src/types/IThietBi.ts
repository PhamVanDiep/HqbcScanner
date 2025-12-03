import { IThongSo } from "./IThongSo";

export interface IThietBi {
  maThietBi?: string;
  maThietBiCha?: string;
  tenThietBi?: string;
  code?: string;
  qrCode?: string;
  qrCodePath?: string;
  maNhaMay?: string;
  stt?: number;
  thongSos?: IThongSo[];
}
