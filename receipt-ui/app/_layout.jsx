import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Stack, Redirect, useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)
  const router = useRouter()

  useFocusEffect(
    useCallback(()=> {
    const checkAuth = async () => {
      console.log('checkauth')
      try{
        const token = await AsyncStorage.getItem('token');
        console.log('token:', token);
        if(!token){
          router.replace('/auth/Login')
          return
        }
        setHasChecked(true)
      } catch(e) {
        console.log('Failed to read token', e)
        router.replace('/auth/Login')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
   }, [hasChecked])
  )

  if(isLoading) return <Text style={{textAlign:'center', marginTop:50}}>Is Loading </Text>

  return <Tabs />;
}