import { StatusBar } from 'react-native'
import {
  useFonts,
  // eslint-disable-next-line camelcase
  Roboto_400Regular,
  // eslint-disable-next-line camelcase
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { GluestackUIProvider } from '@gluestack-ui/themed'

import { config } from './config/gluestack-ui.config'
import { Loading } from '@components/loading'
import { SignUp } from '@screens/sign-up'

export default function App() {
  // eslint-disable-next-line camelcase
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoaded ? <SignUp /> : <Loading />}
    </GluestackUIProvider>
  )
}
