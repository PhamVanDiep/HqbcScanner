import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRScannerScreen from '../screens/QRScannerScreen';
import DeviceSearchScreen from '../screens/DeviceSearchScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MainTabNavigator from './MainTabNavigator';
import type {IThietBi} from '../types';

export type RootStackParamList = {
  MainTabs: {
    screen?: string;
    params?: {
      device?: IThietBi;
    };
  } | undefined;
  QRScanner: undefined;
  DeviceForm: {
    deviceId: string;
    deviceName: string;
  };
  DeviceSearchScreen: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScannerScreen}
          options={{
            title: 'Quét QR Code',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="DeviceSearchScreen"
          component={DeviceSearchScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            title: 'Đổi mật khẩu',
            headerShown: true,
          }}
        />
        {/* <Stack.Screen
          name="DeviceForm"
          component={DeviceFormScreen}
          options={{
            title: 'Thông tin thiết bị',
            headerShown: false,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
