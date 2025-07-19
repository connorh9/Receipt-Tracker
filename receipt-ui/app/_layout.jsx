import React from 'react';
import { Tabs, Stack, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(()=> {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('token:', token);
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error('Failed to read token:', e);
    }
    
    }
    checkAuth()
  }, [])

  if(isLoading) return <Text>Is Loading </Text>

  if(!isLoggedIn){
    return <Redirect href='/auth/Login'/>;
  }
  return <Tabs />;
}