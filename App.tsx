import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed'

import { config } from './config/gluestack-ui.config'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle='light-content' backgroundColor="transparent" translucent />
      {fontsLoaded ? <Center bg='$gray700'><Text>Open up App.tsx to start working on your app!</Text></Center> : <Center />}
    </GluestackUIProvider>
  );
}