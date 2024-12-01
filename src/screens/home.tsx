import { ExerciseCard } from '@components/exercise-card'
import { Group } from '@components/group'
import { HomeHeader } from '@components/home-header'
import { Text, Heading, HStack, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'
import { FlatList } from 'react-native'

export function Home() {
  const [exercises, setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Emana unilateral',
    'Levantamento terra',
  ])
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro'])
  const [groupSelected, setGroupSelected] = useState('Costas')
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
          keyExtractor={(item) => item}
          renderItem={() => <ExerciseCard />}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </VStack>
    </VStack>
  )
}
