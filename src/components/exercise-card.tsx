import { ExerciseDTO } from '@dtos/exercise-dto'
import {
  Heading,
  VStack,
  Image,
  HStack,
  Text,
  Icon,
} from '@gluestack-ui/themed'
import { api } from '@services/api'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  const { name, series, repetitions, thumb } = data
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${thumb}`,
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {name}
          </Heading>
          <Text
            fontSize="$sm"
            color="$white"
            mt="$1"
            fontFamily="$body"
            numberOfLines={2}
          >
            {series} séries x {repetitions} repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}
