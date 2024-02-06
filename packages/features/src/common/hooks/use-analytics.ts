import { useAppStore } from '../store/app'

type Event =
  | 'wallet_restored'
  | 'wallet_created'
  | 'transaction_sent'
  | 'portfolio_delegated'

type TrackProps = {
  event: Event
  metadata?: Record<string, string | number>
}

export const useAnalytics = () => {
  const canTrack = useAppStore((state) => state.shareData)
  const track = (_props: TrackProps) => {
    if (!canTrack) return
    console.log(_props)
  }
  return { track }
}
