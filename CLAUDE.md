# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HqbcScanner is a React Native mobile application for device management using QR code scanning. The app features authentication with biometric support, device information forms, and data submission to a backend API.

## Development Commands

### Start Development Server
```bash
npm start
# or
yarn start
```

### Run on Platforms
```bash
# Android
npm run android

# iOS (requires CocoaPods setup first)
bundle install
bundle exec pod install
npm run ios
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Run tests
npm test
```

## Architecture

### Project Structure
- `src/api/` - API client configuration (legacy axios client, prefer `src/services/`)
- `src/constants/` - API endpoints and configuration constants
- `src/contexts/` - React Context providers (AuthContext for authentication state)
- `src/navigation/` - Navigation configuration (React Navigation)
- `src/screens/` - Screen components organized by feature
- `src/services/` - API service layer with typed methods
- `src/types/` - TypeScript type definitions (domain models, API responses)
- `src/utils/` - Utility functions (biometric, datetime, error handling)

### Key Architectural Patterns

#### API Layer Architecture
The app uses **two API client implementations**:
1. **Legacy client** (`src/api/config.ts`): Basic axios instance with hardcoded token
2. **Current client** (`src/services/api.service.ts`): Singleton service with request/response interceptors, token management from AsyncStorage, and typed HTTP methods

**Always use the services layer** (`src/services/`) for new API integrations. The legacy API client is marked with TODOs and should be phased out.

#### Authentication Flow
1. **AuthContext** (`src/contexts/AuthContext.tsx`) manages global auth state using React Context
2. **AuthService** (`src/services/auth.service.ts`) handles API calls and data transformation
3. **Token management**: Access tokens stored in AsyncStorage, automatically injected via interceptor
4. **Biometric authentication**: Uses `react-native-biometrics` with fallback to username storage
5. **Route protection**: RootNavigator conditionally renders AuthNavigator or main Navigation based on `isAuthenticated` state

#### Navigation Structure
- **RootNavigator**: Top-level router that switches between auth and main navigation
- **AuthNavigator**: Stack navigator for Login/Register screens
- **Navigation**: Main app stack navigator (QRScanner → DeviceForm flow)

The app uses React Navigation v7 with native stack navigators for better performance.

#### Backend Response Transformation
Backend responses follow a wrapper structure:
```typescript
{
  code: 200,
  message: string,
  data: {
    info: IQUser,
    accessToken: string,
    refreshToken: string
  }
}
```

Services transform backend data structures to app-specific models. Example: `AuthService.transformUserInfo()` converts `AuthResponseData` to `AuthResponse`.

#### Type System
TypeScript types are organized by domain model in `src/types/`:
- Entity types prefixed with `I` (e.g., `IQUser`, `IThietBi`)
- Composite ID types suffixed with `Id` (e.g., `IQUserNhaMayId`)
- Re-exported through `src/types/index.ts` for convenience

### Environment Configuration
- **API Base URL**: Configured in `src/constants/api.ts`
  - DEV: `http://192.168.100.178:9000/hqbc-device/v1`
  - PROD: `http://localhost:9000/hqbc-device/v1`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For real devices, use computer's local IP address

## Development Guidelines

### Adding New API Endpoints
1. Define endpoint in `src/constants/api.ts` under `API_ENDPOINTS`
2. Create typed service method in appropriate service file (or new service)
3. Use `ApiService` singleton for HTTP calls with automatic token injection
4. Transform backend response structure to app models before returning

### Adding New Screens
1. Create screen component in `src/screens/` (use feature folders for grouping)
2. Add screen to appropriate navigator in `src/navigation/`
3. Define route params in navigator's type definition
4. Use `useAuth()` hook to access authentication state

### Working with Authentication
- Access auth state via `useAuth()` hook from AuthContext
- Auth functions available: `login()`, `register()`, `logout()`, `loginWithBiometric()`
- User object and loading state automatically managed
- Token refresh logic is currently commented out in API interceptor (lines 51-89 in api.service.ts)

### Native Dependencies
Key native modules requiring setup:
- `react-native-vision-camera` - QR code scanning
- `react-native-biometrics` - Biometric authentication
- `@react-native-async-storage/async-storage` - Local data persistence
- `react-native-vector-icons` - Icon library

After adding native dependencies, rebuild native code:
```bash
# Android
npm run android

# iOS
cd ios && bundle exec pod install && cd ..
npm run ios
```

## Important Notes

- The app requires React Native 0.82.1 and Node.js >= 20
- The project uses TypeScript with React Native's default config
- Token refresh logic exists but is commented out - review before enabling
- Backend API expects Vietnamese language error messages
- QR code data structure is defined in `src/types/index.ts` as `QRCodeData`
