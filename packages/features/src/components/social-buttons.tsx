import { TwitterIcon } from "lucide-react"

export const SocialButtons = () => {
  return (
    <div className="flex gap-2">
      <a href="/" target="_blank" rel="noreferrer">
        Discord
      </a>
      <a href="/" className="flex gap-2" target="_blank" rel="noreferrer">
        <TwitterIcon size={16} />
        Twitter
      </a>
    </div>
  )
}
