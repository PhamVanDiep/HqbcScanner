/**
 * HQBC Scanner App
 * QR Code Scanner for Device Management
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Navigation from './src/navigation';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
