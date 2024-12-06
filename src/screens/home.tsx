import { ExerciseCard } from '@components/exercise-card'
import { Group } from '@components/group'
import { HomeHeader } from '@components/home-header'
import { Loading } from '@components/loading'
import { ToastMessage } from '@components/toast-message'
import { ExerciseDTO } from '@dtos/exercise-dto'
import { useToast, Text, Heading, HStack, VStack } from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/app-error'
import { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'

export function Home() {
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const [groups, setGroups] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const handleOpenExercisesDetails = (exerciseId: string) => {
    navigation.navigate('exercise', { exerciseId })
  }

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups')

      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.'

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
    }
  }

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios.'

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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              item.toLocaleLowerCase() === groupSelected.toLocaleLowerCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 32,
        }}
        style={{
          marginVertical: 40,
          maxHeight: 44,
          minHeight: 44,
        }}
      />
      {isLoading && <Loading />}

      {!isLoading && (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$5" alignItems="center">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercises.length}
            </Text>
          </HStack>
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExercisesDetails(item.id)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            showsHorizontalScrollIndicator={false}
          />
        </VStack>
      )}
    </VStack>
  )
}
