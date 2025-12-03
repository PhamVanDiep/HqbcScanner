import { IThietBi } from './IThietBi';
import { IThongSo } from './IThongSo';
import { ITsvhDatumId } from './ITsvhDatumId';

export interface ITsvhDatum {
  id?: ITsvhDatumId;
  ngay?: string;
  gio?: number;
  phut?: number;
  giaTri?: number;
  nguoiNhap?: string;
  thoiDiemNhap?: string;
  nguoiSua?: string;
  thoiDiemSua?: string;
  thietBi?: IThietBi;
  thongSo?: IThongSo;
}
