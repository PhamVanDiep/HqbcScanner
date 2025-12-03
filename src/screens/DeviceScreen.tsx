import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IThietBi, IThongSo, ITsvhDatum } from '../types';
import { ThietBiService, VanHanhService } from '../services';

interface DeviceScreenProps {
  navigation?: any;
  route?: any;
}

interface DeviceParameters {
  [deviceId: string]: IThongSo[];
}

interface ParameterValues {
  [deviceId: string]: { [parameterId: string]: any };
}

const DeviceScreen: React.FC<DeviceScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [devices, setDevices] = useState<IThietBi[]>([]);
  const [deviceParameters, setDeviceParameters] = useState<DeviceParameters>({});
  const [parameterValues, setParameterValues] = useState<ParameterValues>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // Get device(s) from route params
    if (route.params?.device) {
      const selectedDevice = route.params.device as IThietBi;
      setDevices([selectedDevice]);
      loadDeviceParametersAndHistory([selectedDevice]);
    } else if (route.params?.devices) {
      // Multiple devices from QR scan
      const selectedDevices = route.params.devices as IThietBi[];
      setDevices(selectedDevices);
      loadDeviceParametersAndHistory(selectedDevices);
    }
  }, [route.params]);

  useEffect(() => {
    // Load history data when date changes (but not on initial mount)
    if (devices.length > 0) {
      loadHistoryData();
    }
  }, [selectedDate, devices]);

  const loadDeviceParametersAndHistory = async (devicesToLoad: IThietBi[]) => {
    setInitialLoading(true);
    try {
      // Load parameters for all devices first
      const paramPromises = devicesToLoad.map(device =>
        ThietBiService.findById(device.maThietBi).then(deviceDetail => ({
          deviceId: device.maThietBi,
          parameters: deviceDetail.thongSos || [],
        }))
      );

      const results = await Promise.all(paramPromises);

      // Update device parameters with all loaded data
      const newParams: DeviceParameters = {};
      results.forEach(result => {
        if (result.parameters.length > 0) {
          newParams[result.deviceId] = result.parameters;
        }
      });

      setDeviceParameters(newParams);

      // Then load history data
      await loadHistoryData();
    } catch (error) {
      console.error('Load device parameters error:', error);
      setInitialLoading(false);
    }
  };

  const loadHistoryData = async () => {
    if (devices.length === 0) return;

    setLoading(true);
    try {
      const maThietBis = devices.map(d => d.maThietBi).filter(Boolean) as string[];

      const response = await VanHanhService.lichSuVanHanh({
        dtime: selectedDate,
        maThietBis: maThietBis,
      });

      // Process history data - organize by device
      if (response.data && response.data.length > 0) {
        const historyList = response.data;
        
        // Group parameters by device
        const paramsByDevice: DeviceParameters = {};
        const valuesByDevice: ParameterValues = {};

        historyList.forEach(item => {
          const deviceId = item.thietBi?.maThietBi;
          const paramId = item.thongSo?.maThongSo;

          if (deviceId && paramId) {
            // Initialize device entry if needed
            if (!paramsByDevice[deviceId]) {
              paramsByDevice[deviceId] = [];
            }
            if (!valuesByDevice[deviceId]) {
              valuesByDevice[deviceId] = {};
            }

            // Add parameter if not already added
            if (!paramsByDevice[deviceId].find(p => p.maThongSo === paramId)) {
              paramsByDevice[deviceId].push(item.thongSo);
            }

            // Store parameter value
            valuesByDevice[deviceId][paramId] = item.giaTri;
          }
        });

        // Merge history parameters with existing device parameters
        setDeviceParameters(prev => {
          const merged = { ...prev };
          Object.entries(paramsByDevice).forEach(([deviceId, historyParams]) => {
            const existing = merged[deviceId] || [];
            const combined = [...existing];
            
            historyParams.forEach(histParam => {
              if (!combined.find(p => p.maThongSo === histParam.maThongSo)) {
                combined.push(histParam);
              }
            });
            
            merged[deviceId] = combined;
          });
          return merged;
        });

        setParameterValues(valuesByDevice);
      } else {
        // No history data - keep existing device parameters but clear values
        setParameterValues({});
      }
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleParameterChange = (deviceId: string, maThongSo: string, value: string) => {
    setParameterValues(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        [maThongSo]: value,
      },
    }));
  };

  const handleSave = () => {
    Alert.alert('Lưu dữ liệu', 'Bạn có chắc chắn muốn lưu các thông số này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Lưu',
        onPress: async () => {
          try {
            const savePromises: Promise<any>[] = [];

            // Prepare data for each device and parameter
            devices.forEach(device => {
              const deviceId = device.maThietBi;
              const deviceValues = parameterValues[deviceId];

              if (deviceValues) {
                Object.entries(deviceValues).forEach(([maThongSo, giaTri]) => {
                  const tsvhData: ITsvhDatum = {
                    id: {
                      maThongSoTb: '',
                      ngayGio: new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                      selectedDate.getHours(),
                      selectedDate.getMinutes(),
                    ),
                    },
                    giaTri: giaTri ? parseFloat(giaTri) : null,
                    thietBi: {
                      maThietBi: deviceId,
                    },
                    thongSo: {
                      maThongSo: maThongSo,
                    },
                    ngay: new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate(),
                    ),
                    gio: selectedDate.getHours(),
                    phut: selectedDate.getMinutes(),
                  };
                  savePromises.push(VanHanhService.save(tsvhData));
                });
              }
            });

            await Promise.all(savePromises);
            Alert.alert('Thành công', 'Đã lưu dữ liệu thành công');

            // Reload history data
            loadHistoryData();
          } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
          }
        },
      },
    ]);
  };

  const onDateChange = (event: any, selectedDateValue?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDateValue) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(selectedDateValue.getFullYear());
      newDate.setMonth(selectedDateValue.getMonth());
      newDate.setDate(selectedDateValue.getDate());
      setSelectedDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTimeValue?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTimeValue) {
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedTimeValue.getHours());
      newDate.setMinutes(selectedTimeValue.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const renderSearchHeader = () => (
    <TouchableOpacity
      style={styles.searchHeader}
      onPress={() => navigation.navigate('DeviceSearchScreen')}>
      <Icon name="magnify" size={20} color="#999" />
      <Text style={styles.searchPlaceholder}>Tìm kiếm thiết bị...</Text>
      {/* <Icon name="qrcode-scan" size={20} color="#007AFF" /> */}
    </TouchableOpacity>
  );

  const renderDateTimePicker = () => (
    <View style={styles.dateTimeContainer}>
      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar" size={20} color="#007AFF" />
        <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateTimeButton}
        onPress={() => setShowTimePicker(true)}>
        <Icon name="clock-outline" size={20} color="#007AFF" />
        <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </View>
  );

  const renderDeviceInfo = () => {
    if (devices.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="devices" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Chọn thiết bị để xem thông tin</Text>
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
      <>{renderDateTimePicker()}
        <ScrollView style={styles.content}>
          {initialLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Đang tải thông số...</Text>
            </View>
          ) : (
            devices.map((device, deviceIndex) => {
              const deviceId = device.maThietBi;
              const parameters = deviceParameters[deviceId] || [];
              const values = parameterValues[deviceId] || {};

              return (
                <View key={deviceId || deviceIndex}>
                  <View style={styles.deviceCard}>
                    <View style={styles.deviceHeader}>
                      {device.code && <Text style={styles.deviceCode}>{device.code}</Text>}
                      {device.tenThietBi && (
                        <Text style={styles.deviceName}>{' - ' + device.tenThietBi}</Text>
                      )}
                    </View>
                  </View>

                  {parameters.length > 0 ? (
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
                              value={
                                values[param.maThongSo || ''] !== undefined && values[param.maThongSo || ''] !== null
                                  ? String(values[param.maThongSo || ''])
                                  : ''
                              }
                              onChangeText={value =>
                                handleParameterChange(deviceId, param.maThongSo || '', value)
                              }
                            />
                            {param.dvt && <Text style={styles.unit}>{param.dvt}</Text>}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderSearchHeader()}
      {renderDeviceInfo()}
      {devices.length > 0 && Object.keys(deviceParameters).length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Lưu dữ liệu</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceCode: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  deviceName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
    marginTop: 8,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  parametersCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
