# API Documentation - HQBC Scanner

## Base URL
```
https://your-api-domain.com/api/v1
```

## Endpoints

### 1. Get Device Fields
Lấy thông tin các trường cần nhập sau khi scan QR code

**Endpoint:** `POST /device/fields`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body:**
```json
{
  "deviceId": "DEVICE_12345",
  "type": "scanner"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "deviceId": "DEVICE_12345",
    "deviceName": "Máy quét ABC",
    "fields": [
      {
        "id": "location",
        "label": "Vị trí",
        "type": "text",
        "required": true,
        "placeholder": "Nhập vị trí đặt thiết bị",
        "defaultValue": ""
      },
      {
        "id": "floor",
        "label": "Tầng",
        "type": "select",
        "required": true,
        "options": [
          { "label": "Tầng 1", "value": "1" },
          { "label": "Tầng 2", "value": "2" },
          { "label": "Tầng 3", "value": "3" }
        ],
        "defaultValue": "1"
      },
      {
        "id": "building",
        "label": "Toà nhà",
        "type": "text",
        "required": false,
        "placeholder": "Nhập tên toà nhà",
        "defaultValue": ""
      },
      {
        "id": "manufacturer",
        "label": "Nhà sản xuất",
        "type": "text",
        "required": false,
        "placeholder": "Nhập nhà sản xuất",
        "defaultValue": ""
      },
      {
        "id": "model",
        "label": "Model",
        "type": "text",
        "required": false,
        "placeholder": "Nhập model thiết bị",
        "defaultValue": ""
      },
      {
        "id": "yearOfManufacture",
        "label": "Năm sản xuất",
        "type": "number",
        "required": false,
        "placeholder": "Nhập năm sản xuất",
        "defaultValue": ""
      },
      {
        "id": "status",
        "label": "Trạng thái",
        "type": "select",
        "required": true,
        "options": [
          { "label": "Đang hoạt động", "value": "active" },
          { "label": "Bảo trì", "value": "maintenance" },
          { "label": "Hỏng", "value": "broken" }
        ],
        "defaultValue": "active"
      },
      {
        "id": "notes",
        "label": "Ghi chú",
        "type": "textarea",
        "required": false,
        "placeholder": "Nhập ghi chú về thiết bị",
        "defaultValue": ""
      }
    ]
  }
}
```

**Response Error (400/404):**
```json
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Không tìm thấy thiết bị với mã này"
  }
}
```

---

### 2. Save Device Information
Lưu thông tin thiết bị sau khi người dùng nhập

**Endpoint:** `POST /device/save`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body:**
```json
{
  "deviceId": "DEVICE_12345",
  "data": {
    "location": "Phòng IT - Tầng 3",
    "floor": "3",
    "building": "Toà A",
    "manufacturer": "ABC Corp",
    "model": "Model-X100",
    "yearOfManufacture": 2023,
    "status": "active",
    "notes": "Thiết bị mới lắp đặt"
  },
  "scannedAt": "2025-11-30T10:30:00Z",
  "scannedBy": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "record_789",
    "deviceId": "DEVICE_12345",
    "message": "Lưu thông tin thiết bị thành công",
    "savedAt": "2025-11-30T10:30:15Z"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "location",
        "message": "Trường này là bắt buộc"
      }
    ]
  }
}
```

---

## QR Code Format

QR code phải chứa chuỗi JSON với cấu trúc sau:

```json
{
  "deviceId": "DEVICE_12345",
  "type": "scanner"
}
```

hoặc đơn giản hơn:
```json
{
  "deviceId": "DEVICE_12345"
}
```

---

## Field Types Supported

| Type | Description | Example |
|------|-------------|---------|
| `text` | Input text đơn giản | location, building |
| `number` | Input số | yearOfManufacture |
| `textarea` | Text area nhiều dòng | notes |
| `select` | Dropdown select | floor, status |
| `date` | Date picker | installationDate |

---

## Authentication

API yêu cầu Bearer token trong header Authorization. Token có thể được lấy từ login endpoint (cần implement riêng).

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `DEVICE_NOT_FOUND` | Không tìm thấy thiết bị |
| `VALIDATION_ERROR` | Lỗi validation dữ liệu |
| `UNAUTHORIZED` | Chưa đăng nhập hoặc token không hợp lệ |
| `FORBIDDEN` | Không có quyền truy cập |
| `INTERNAL_ERROR` | Lỗi server |

---

## Notes for Backend Developer

1. Endpoint `/device/fields` nên trả về danh sách các trường động dựa trên loại thiết bị
2. Field types hỗ trợ: `text`, `number`, `textarea`, `select`, `date`
3. Mỗi field cần có: `id`, `label`, `type`, `required`, và `defaultValue`
4. Fields với type `select` cần có thêm `options` array
5. Validation cần kiểm tra các trường `required` và format dữ liệu
6. Response error nên rõ ràng để hiển thị cho người dùng
