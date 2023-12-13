import { TwitterIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const SocialButtons = () => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" asChild className="flex-1">
        <a href={DISCORD_URL} target="_blank">
          Discord
        </a>
      </Button>
      <Button variant="outline" asChild className="flex-1">
        <a href={TWITTER_URL} className="flex gap-2" target="_blank">
          <TwitterIcon size={16} />
          Twitter
        </a>
      </Button>
    </div>
  )
}
