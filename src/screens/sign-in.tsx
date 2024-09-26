import { VStack, Image, Center, Text, Heading } from '@gluestack-ui/themed'

import backgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/input'
import { Button } from '@components/button'

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
      <VStack flex={1} px="$10" pb="$16">
        <Center my="$24">
          <Logo />
          <Text color="$gray100" fontSize="$sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color="$gray100">Acesse a conta</Heading>
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />

          <Button title="teste" />
        </Center>
      </VStack>
    </VStack>
  )
}
