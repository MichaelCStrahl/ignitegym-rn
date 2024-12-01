import { HistoryCard } from '@components/history-card'
import { ScreenHeader } from '@components/screen-header'
import { VStack } from '@gluestack-ui/themed'

export function History() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />
      <HistoryCard />
    </VStack>
  )
}
