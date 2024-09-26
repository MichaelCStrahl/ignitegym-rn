import { VStack, Image } from '@gluestack-ui/themed'

import backgroundImg from '@assets/background.png'

export function SignIn() {
  return (
    <VStack flex={1} bg="$gray700">
      <Image
        source={backgroundImg}
        defaultSource={backgroundImg}
        w="$full"
        h={624}
        alt="Pessoas treinando"
        position="absolute"
      />
    </VStack>
  )
}
