import { useJitsu } from '@jitsu/jitsu-react'

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
  const { analytics } = useJitsu()
  const canTrack = useAppStore((state) => state.shareData)
  const track = ({ event, metadata }: TrackProps) => {
    if (!canTrack) return
    return analytics.track(event, metadata)
  }
  return { track }
}
