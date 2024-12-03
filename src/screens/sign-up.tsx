import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
} from '@gluestack-ui/themed'

import backgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/input'
import { Button } from '@components/button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useForm, Controller } from 'react-hook-form'

type SignUpFormData = {
  name: string
  email: string
  password: string
  password_confirm: string
}

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const handleGoSignIn = () => {
    navigation.navigate('signId')
  }

  const handleSignUp = (data: SignUpFormData) => {
    console.log(data)
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
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

          <Center flex={1} gap="$2">
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  placeholder="Nome"
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  placeholder="E-mail"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  keyboardType="email-address"
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              name="password_confirm"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  placeholder="Confirme a senha"
                  secureTextEntry
                  onChangeText={onChange}
                  returnKeyType="send"
                  errorMessage={errors.password_confirm?.message}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                />
              )}
            />

            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)}
            />
          </Center>

          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoSignIn}
          />
        </VStack>
      </VStack>
    </ScrollView>
  )
}
