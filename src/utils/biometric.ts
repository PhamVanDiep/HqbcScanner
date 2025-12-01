import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export class BiometricUtils {
  static async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType: BiometryTypes | null;
  }> {
    try {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      return {available, biometryType};
    } catch (error) {
      console.error('Biometric check error:', error);
      return {available: false, biometryType: null};
    }
  }

  static async authenticate(
    promptMessage: string = 'Xác thực để đăng nhập',
  ): Promise<{success: boolean; error?: string}> {
    try {
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Hủy',
      });

      return {success};
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message || 'Xác thực thất bại',
      };
    }
  }

  static getBiometryTypeName(type: BiometryTypes | null): string {
    switch (type) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Vân tay';
      default:
        return 'Sinh trắc học';
    }
  }
}
