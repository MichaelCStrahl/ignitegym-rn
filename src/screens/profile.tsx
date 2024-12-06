import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'
import defaultUserPhoto from '@assets/userPhotoDefault.png'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { ScreenHeader } from '@components/screen-header'
import { UserPhoto } from '@components/user-photo'
import {
  Center,
  Heading,
  Text,
  VStack,
  useToast,
  Box,
  Spinner,
} from '@gluestack-ui/themed'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { ToastMessage } from '@components/toast-message'
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@contexts/auth-context'
import { api } from '@services/api'
import { AppError } from '@utils/app-error'

type ProfileSchema = {
  name: string
  email: string
  password: string
  old_password: string
  password_confirmed: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  password_confirmed: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password'), ''], 'As senhas não conferem.')
    .when('password', {
      is: (value: string | null) => value,
      then: () =>
        yup
          .string()
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => value || null),
    }),
})

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { user, updateUserProfile } = useAuth()

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  })

  const handleProfileUpdate = async (data: ProfileSchema) => {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Perfil atualizado com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o perfil. Tente novamente mais tarde.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUserPhotoSelect = async () => {
    try {
      setPhotoIsLoading(true)

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Erro ao enviar a imagem!"
                description="Essa imagem é muito grande. Escolha uma de até 5MB"
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        const fileExtension = photoURI.split('.').pop()

        const photoFile = {
          uri: photoURI,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          name: `${user.name}.${fileExtension}`.toLowerCase(),
        } as unknown

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar

        await updateUserProfile(userUpdated)

        return toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto atualizada!"
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
        <Center mt="$6" px="$10">
          {photoIsLoading && (
            <Box
              w="$32"
              h="$32"
              borderColor="$gray400"
              backgroundColor="$gray500"
              alignItems="center"
              justifyContent="center"
              rounded="$full"
            >
              <Spinner color="$green500" />
            </Box>
          )}
          {!photoIsLoading && (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhoto
              }
              alt="Foto do usuário"
              size="xl"
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  isReadOnly
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            color="$gray200"
            fontFamily="$heading"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg="$gray600"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg="$gray600"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirmed"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.password_confirmed?.message}
                />
              )}
            />
            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
