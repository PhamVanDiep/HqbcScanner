import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRScannerScreen from '../screens/QRScannerScreen';
import DeviceFormScreen from '../screens/DeviceFormScreen';
import type {Field} from '../types';

export type RootStackParamList = {
  QRScanner: undefined;
  DeviceForm: {
    deviceId: string;
    deviceName: string;
    fields: Field[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="QRScanner"
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
          name="QRScanner"
          component={QRScannerScreen}
          options={{
            title: 'Quét QR Code',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="DeviceForm"
          component={DeviceFormScreen}
          options={{
            title: 'Thông tin thiết bị',
            headerShown: false, // Using custom header in DeviceFormScreen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
