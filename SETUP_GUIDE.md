# HQBC Scanner - Hướng dẫn cài đặt và sử dụng

## Tổng quan

Ứng dụng React Native cho phép quét QR code để lấy thông tin thiết bị và nhập dữ liệu thông qua form động.

## Cài đặt

### Yêu cầu
- Node.js >= 20
- React Native development environment (Android Studio hoặc Xcode)
- iOS: macOS với Xcode
- Android: Android Studio với SDK

### Các bước cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Cài đặt iOS pods (chỉ cho iOS):**
```bash
cd ios
pod install
cd ..
```

3. **Cấu hình API Endpoint:**

Mở file `src/api/config.ts` và cập nhật:

```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api/v1';
export const API_TOKEN = 'YOUR_ACCESS_TOKEN';
```

## Chạy ứng dụng

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Tính năng

### 1. Quét QR Code
- Mở ứng dụng, camera sẽ tự động kích hoạt
- Đưa mã QR vào khung hình để quét
- QR code phải chứa JSON với format:
  ```json
  {
    "deviceId": "DEVICE_12345",
    "type": "scanner"
  }
  ```

### 2. Form nhập liệu động
- Sau khi quét QR, ứng dụng sẽ gọi API để lấy danh sách các trường cần nhập
- Form được render động dựa trên response từ API
- Hỗ trợ các loại trường:
  - `text`: Input text đơn giản
  - `number`: Input số
  - `textarea`: Text area nhiều dòng
  - `select`: Dropdown/Radio buttons
  - `date`: Date picker (có thể mở rộng)

### 3. Lưu thông tin
- Nhập đầy đủ thông tin (các trường bắt buộc có dấu *)
- Nhấn "Lưu thông tin" để gửi dữ liệu lên server
- Hiển thị thông báo thành công/lỗi

## Cấu trúc dự án

```
HqbcScanner/
├── src/
│   ├── api/
│   │   ├── config.ts          # Cấu hình API (BASE_URL, TOKEN)
│   │   └── deviceService.ts   # Service gọi API
│   ├── navigation/
│   │   └── index.tsx          # React Navigation setup
│   ├── screens/
│   │   ├── QRScannerScreen.tsx   # Màn hình quét QR
│   │   └── DeviceFormScreen.tsx  # Màn hình form nhập liệu
│   └── types/
│       └── index.ts           # TypeScript types
├── android/                   # Android native code
├── ios/                      # iOS native code
├── API_DOCUMENTATION.md      # Tài liệu API cho backend developer
└── App.tsx                   # Root component
```

## API Documentation

Xem file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) để biết chi tiết về các endpoint và format dữ liệu.

## Permissions

### iOS (Info.plist)
- `NSCameraUsageDescription`: Truy cập camera để quét QR
- `NSMicrophoneUsageDescription`: Cần thiết cho camera

### Android (AndroidManifest.xml)
- `CAMERA`: Truy cập camera
- `INTERNET`: Gọi API

## Troubleshooting

### Lỗi camera không hoạt động
1. Kiểm tra permissions trong Settings của thiết bị
2. Khởi động lại app
3. Rebuild app: `npm run android` hoặc `npm run ios`

### Lỗi kết nối API
1. Kiểm tra `API_BASE_URL` trong `src/api/config.ts`
2. Kiểm tra token authorization
3. Kiểm tra kết nối internet của thiết bị
4. Xem logs: `npx react-native log-android` hoặc `npx react-native log-ios`

### Build errors
```bash
# Clean build (Android)
cd android && ./gradlew clean && cd ..
npm run android

# Clean build (iOS)
cd ios && pod deinstall && pod install && cd ..
npm run ios
```

## Backend Implementation

Backend developer cần implement 2 endpoints theo spec trong `API_DOCUMENTATION.md`:

1. `POST /device/fields` - Trả về danh sách các trường cần nhập
2. `POST /device/save` - Lưu thông tin thiết bị

## TODO: Các tính năng có thể mở rộng

- [ ] Implement login flow thực tế (hiện tại dùng hardcoded token)
- [ ] Thêm offline mode (lưu local khi mất mạng, sync sau)
- [ ] Thêm field type `date` với date picker
- [ ] Thêm field type `image` cho upload ảnh
- [ ] Lịch sử quét QR code
- [ ] Dark mode support
- [ ] Multi-language support

## Liên hệ

Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.
