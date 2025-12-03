import { IThietBi } from './IThietBi';
import { IThongSo } from './IThongSo';
import { ITsvhDatumId } from './ITsvhDatumId';

export interface ITsvhDatum {
  id?: ITsvhDatumId;
  ngay?: any;
  gio?: number;
  phut?: number;
  giaTri?: number;
  nguoiNhap?: string;
  thoiDiemNhap?: any;
  nguoiSua?: string;
  thoiDiemSua?: any;
  thietBi?: IThietBi;
  thongSo?: IThongSo;
}
