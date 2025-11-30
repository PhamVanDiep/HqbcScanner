import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import deviceService from '../api/deviceService';
import type {Field} from '../types';

type RootStackParamList = {
  QRScanner: undefined;
  DeviceForm: {
    deviceId: string;
    deviceName: string;
    fields: Field[];
  };
};

type DeviceFormRouteProp = RouteProp<RootStackParamList, 'DeviceForm'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DeviceFormScreen = () => {
  const route = useRoute<DeviceFormRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {deviceId, deviceName, fields} = route.params;

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.id] = field.defaultValue;
    });
    return initialData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({...prev, [fieldId]: value}));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (value === '' || value === null || value === undefined) {
          newErrors[field.id] = `${field.label} là bắt buộc`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await deviceService.saveDeviceInfo({
        deviceId,
        data: formData,
        scannedAt: new Date().toISOString(),
      });

      if (response.success) {
        Alert.alert(
          'Thành công',
          response.data?.message || 'Lưu thông tin thiết bị thành công',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('QRScanner'),
            },
          ],
        );
      } else {
        if (response.error?.details) {
          const fieldErrors: Record<string, string> = {};
          response.error.details.forEach(detail => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        }
        Alert.alert('Lỗi', response.error?.message || 'Không thể lưu dữ liệu');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu dữ liệu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const hasError = !!errors[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, hasError && styles.inputError]}
              value={String(formData[field.id] || '')}
              onChangeText={value => updateField(field.id, value)}
              placeholder={field.placeholder}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textarea,
                hasError && styles.inputError,
              ]}
              value={String(formData[field.id] || '')}
              onChangeText={value => updateField(field.id, value)}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'select':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={[styles.selectContainer, hasError && styles.inputError]}>
              {field.options?.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    formData[field.id] === option.value &&
                      styles.selectOptionActive,
                  ]}
                  onPress={() => updateField(field.id, option.value)}>
                  <Text
                    style={[
                      styles.selectOptionText,
                      formData[field.id] === option.value &&
                        styles.selectOptionTextActive,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{deviceName}</Text>
        <Text style={styles.headerSubtitle}>Mã: {deviceId}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {fields.map(field => renderField(field))}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Lưu thông tin</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}>
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textarea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  selectContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectOptionActive: {
    backgroundColor: '#007AFF',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectOptionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default DeviceFormScreen;
