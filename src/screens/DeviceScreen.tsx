import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IThietBi, IThongSo} from '../types';

interface DeviceScreenProps {
  navigation?: any;
  route?: any;
}

const DeviceScreen: React.FC<DeviceScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [device, setDevice] = useState<IThietBi | null>(null);
  const [parameters, setParameters] = useState<IThongSo[]>([]);
  const [parameterValues, setParameterValues] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get device from route params
    if (route.params?.device) {
      const selectedDevice = route.params.device as IThietBi;
      setDevice(selectedDevice);
      // TODO: Load parameters for this device
      loadDeviceParameters(selectedDevice.maThietBi);
    }
  }, [route.params]);

  const loadDeviceParameters = async (maThietBi?: string) => {
    if (!maThietBi) return;

    setLoading(true);
    try {
      // TODO: Call API to get device parameters
      // const params = await ThietBiService.getParameters(maThietBi);
      // setParameters(params);

      // Mock data for now
      const mockParams: IThongSo[] = [
        {maThongSo: 'TS001', tenThongSo: 'Nhiệt độ', dvt: '°C', kyHieu: 'T'},
        {maThongSo: 'TS002', tenThongSo: 'Áp suất', dvt: 'bar', kyHieu: 'P'},
        {maThongSo: 'TS003', tenThongSo: 'Lưu lượng', dvt: 'm3/h', kyHieu: 'Q'},
      ];
      setParameters(mockParams);
    } catch (error) {
      console.error('Load parameters error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (maThongSo: string, value: string) => {
    setParameterValues(prev => ({
      ...prev,
      [maThongSo]: value,
    }));
  };

  const handleSave = () => {
    Alert.alert(
      'Lưu dữ liệu',
      'Bạn có chắc chắn muốn lưu các thông số này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Lưu',
          onPress: async () => {
            try {
              // TODO: Call API to save parameter values
              console.log('Saving values:', parameterValues);
              Alert.alert('Thành công', 'Đã lưu dữ liệu thành công');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
            }
          },
        },
      ],
    );
  };

  const renderSearchHeader = () => (
    <TouchableOpacity
      style={styles.searchHeader}
      onPress={() => navigation.navigate('DeviceSearchScreen')}>
      <Icon name="magnify" size={20} color="#999" />
      <Text style={styles.searchPlaceholder}>Tìm kiếm thiết bị...</Text>
      <Icon name="qrcode-scan" size={20} color="#007AFF" />
    </TouchableOpacity>
  );

  const renderDeviceInfo = () => {
    if (!device) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="devices" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Chọn thiết bị để xem thông tin
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('DeviceSearchScreen')}>
            <Icon name="magnify" size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Tìm kiếm thiết bị</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.deviceCard}>
          <Text style={styles.sectionTitle}>Thông tin thiết bị</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên thiết bị:</Text>
            <Text style={styles.infoValue}>{device.tenThietBi}</Text>
          </View>
          {device.code && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã thiết bị:</Text>
              <Text style={styles.infoValue}>{device.code}</Text>
            </View>
          )}
          {device.maNhaMay && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nhà máy:</Text>
              <Text style={styles.infoValue}>{device.maNhaMay}</Text>
            </View>
          )}
          {device.qrCode && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>QR Code:</Text>
              <Text style={styles.infoValue}>{device.qrCode}</Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải thông số...</Text>
          </View>
        ) : parameters.length > 0 ? (
          <View style={styles.parametersCard}>
            <Text style={styles.sectionTitle}>Thông số vận hành</Text>
            {parameters.map((param, index) => (
              <View key={param.maThongSo || index} style={styles.parameterRow}>
                <View style={styles.parameterInfo}>
                  <Text style={styles.parameterName}>{param.tenThongSo}</Text>
                  {param.kyHieu && (
                    <Text style={styles.parameterSymbol}>({param.kyHieu})</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.parameterInput}
                    placeholder="Nhập giá trị"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={parameterValues[param.maThongSo || ''] || ''}
                    onChangeText={value =>
                      handleParameterChange(param.maThongSo || '', value)
                    }
                  />
                  {param.dvt && (
                    <Text style={styles.unit}>{param.dvt}</Text>
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}>
              <Icon name="content-save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Lưu dữ liệu</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderSearchHeader()}
      {renderDeviceInfo()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  deviceCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  parametersCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parameterRow: {
    marginBottom: 16,
  },
  parameterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  parameterSymbol: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  parameterInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DeviceScreen;
