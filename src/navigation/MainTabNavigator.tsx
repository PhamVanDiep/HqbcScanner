import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DeviceScreen from '../screens/DeviceScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import UserScreen from '../screens/UserScreen';
import {useNavigation} from '@react-navigation/native';
import {IThietBi} from '../types';

export type TabParamList = {
  DeviceTab: {
    device?: IThietBi;
  } | undefined;
  QRTab: undefined;
  UserTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Dummy component for QR tab (will navigate to QRScannerScreen)
const QRTabPlaceholder = () => null;

const MainTabNavigator: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tab.Screen
        name="DeviceTab"
        component={DeviceScreen}
        options={{
          tabBarLabel: 'Thiết bị',
          tabBarIcon: ({color, size}) => (
            <Icon name="devices" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QRTab"
        component={QRTabPlaceholder}
        options={{
          tabBarLabel: 'Quét QR',
          tabBarIcon: ({color, size}) => (
            <Icon name="qrcode-scan" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();
            // Navigate to QRScannerScreen as a modal
            navigation.navigate('QRScanner' as never);
          },
        }}
      />
      <Tab.Screen
        name="UserTab"
        component={UserScreen}
        options={{
          tabBarLabel: 'Người dùng',
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
