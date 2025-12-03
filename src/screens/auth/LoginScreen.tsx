import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {BiometricUtils} from '../../utils/biometric';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {login, loginWithBiometric, isLoading} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const {available, biometryType} =
      await BiometricUtils.isBiometricAvailable();
    setBiometricAvailable(available);
    if (biometryType) {
      setBiometricType(BiometricUtils.getBiometryTypeName(biometryType));
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await login({username, password});
    } catch (error: any) {
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';

      if (error.message === 'Network Error') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra:\n' +
          '- Server đã được khởi động chưa?\n' +
          '- Địa chỉ IP trong cấu hình có đúng không?\n' +
          '- Kết nối mạng có ổn định không?';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Đăng nhập thất bại', errorMessage);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await loginWithBiometric();
    } catch (error: any) {
      Alert.alert(
        'Đăng nhập thất bại',
        error.message || 'Có lỗi xảy ra, vui lòng thử lại',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Icon name="store" size={80} color="#2196F3" /> */}
        <Text style={styles.title}>Quản lý vận hành thiết bị</Text>
        {/* <Text style={styles.subtitle}>Quản lý cửa hàng thông minh</Text> */}
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon
            name="account"
            size={24}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="lock"
            size={24}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        {/* {biometricAvailable && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
            disabled={isLoading}>
            <Icon
              name={
                Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint'
              }
              size={24}
              color="#2196F3"
            />
            <Text style={styles.biometricButtonText}>
              Đăng nhập bằng {biometricType}
            </Text>
          </TouchableOpacity>
        )} */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    flex: 1.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 10,
    height: 50,
    marginTop: 16,
  },
  biometricButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
