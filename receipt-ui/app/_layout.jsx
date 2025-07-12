import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="summary" options={{ title: 'Summary' }} />
      <Tabs.Screen name="capture" options={{ title: 'Capture' }} />
      <Tabs.Screen name="analysis" options={{ title: 'Analysis' }} />
      <Tabs.Screen name="login" options={{ title: 'Login' }}/>
      <Tabs.Screen name="Register" options={{ title: 'Register' }}/>

    </Tabs>
  )
}