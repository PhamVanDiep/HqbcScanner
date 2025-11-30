import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import deviceService from '../api/deviceService';
import type {QRCodeData} from '../types';

type RootStackParamList = {
  QRScanner: undefined;
  DeviceForm: {
    DeviceID: string;
    deviceName: string;
    fields: any[];
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QRScannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const device = useCameraDevice('back');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'granted');

    if (permission === 'denied') {
      Alert.alert(
        'Cần quyền truy cập camera',
        'Vui lòng cấp quyền truy cập camera trong cài đặt để sử dụng tính năng quét QR code.',
        [{text: 'OK'}],
      );
    }
  };

  const handleQRCodeScanned = async (codes: any[]) => {
    if (isProcessing || codes.length === 0) {
      return;
    }

    const qrValue = codes[0]?.value;
    if (!qrValue) {
      return;
    }

    setIsProcessing(true);

    try {
      // Parse QR code data
      const qrData: QRCodeData = JSON.parse(qrValue);
      console.log(qrData);
      
      if (!qrData.DeviceID) {
        Alert.alert('Lỗi', 'QR code không hợp lệ: Thiếu mã thiết bị');
        setIsProcessing(false);
        return;
      }

      // Call API to get device fields
      const response = await deviceService.getDeviceFields(
        qrData.DeviceID,
        qrData.type,
      );

      if (!response.success || !response.data) {
        Alert.alert(
          'Lỗi',
          response.error?.message || 'Không thể lấy thông tin thiết bị',
        );
        setIsProcessing(false);
        return;
      }

      // Navigate to form screen
      navigation.navigate('DeviceForm', {
        DeviceID: response.data.DeviceID,
        deviceName: response.data.deviceName,
        fields: response.data.fields,
      });
    } catch (error: any) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Lỗi',
        'QR code không đúng định dạng. Vui lòng quét lại.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleQRCodeScanned,
  });

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Đang yêu cầu quyền truy cập camera...
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={checkCameraPermission}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          Không tìm thấy camera trên thiết bị
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isProcessing}
        codeScanner={codeScanner}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructionText}>
            Đưa mã QR vào khung hình để quét
          </Text>
        </View>

        <View style={styles.middleContainer}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>

        <View style={styles.bottomOverlay}>
          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>
                Đang xử lý...
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  middleContainer: {
    flexDirection: 'row',
    height: 300,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default QRScannerScreen;
