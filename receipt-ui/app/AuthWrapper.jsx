// AuthWrapper.js
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { router, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('token:', token);
        
        if (token) {
            console.log("Token empty ")
            setIsAuthenticated(true) 
        }
        
      } catch (e) {
        console.error('Failed to read token:', e);
      } finally{
        setIsLoading(false)
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/Login" />;
  }

  return children;
}