import React, { useCallback, useEffect, useState } from 'react';
import { Slot, Tabs, Stack, Redirect, useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthWrapper from './AuthWrapper';
import { Text } from 'react-native';

export default function RootLayout() {
  return <Slot />;
}