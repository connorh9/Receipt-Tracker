import React from 'react';
import { Tabs, Stack, Redirect } from 'expo-router'
import { useEffect, useState } from 'react';


export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true)
  console.log("Reached second layout page")
  
  return (
    <Tabs>
      <Tabs.Screen name="summary" options={{ title: 'Summary' }} />
      <Tabs.Screen name="capture" options={{ title: 'Capture' }} />
      <Tabs.Screen name="analysis" options={{ title: 'Analysis' }} />
      {/* <Tabs.Screen name="login" options={{ title: 'Login' }}/>
      <Tabs.Screen name="Register" options={{ title: 'Register' }}/> */}

    </Tabs>
  )
}