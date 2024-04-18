import { ExternalLinkIcon } from 'lucide-react'

import Logo from '@/common/assets/logo.svg?react'
import QuestionIcon from '@/common/assets/question.svg?react'
import { Button } from '@/components/ui/button'

export const WelcomeScreen = () => {
  return (
    <div className="flex flex-1 bg-card items-center justify-center">
      <div className="flex z-10 flex-col gap-4 w-[370px] h-[600px] bg-background rounded-lg shadow-lg p-8">
        <div className="flex flex-1 flex-col justify-center items-center gap-4">
          <Logo />
          <h1 className="font-semibold text-3xl">Ready to open</h1>
          <p className="text-center text-quaternary text-md">
            Just click on the Pallad icon in your extensions
          </p>
          <p className="text-muted-foreground">or use this handy shortcut</p>
          <div className="flex gap-2 items-center">
            <Button variant="tertiary" size="lg">
              option
            </Button>
            <Button variant="outline" size="lg">
              shift
            </Button>
            <Button variant="outline" size="lg">
              P
            </Button>
          </div>
        </div>
        <a href="https://pallad.xyz" target="_blank" rel="noopener noreferrer">
          <div className="flex bg-card rounded-md p-4 gap-4 items-center">
            <div className="bg-background p-3 rounded-full">
              <QuestionIcon />
            </div>
            <div className="flex flex-1 flex-col">
              <h2 className="text-lg font-semibold">About Pallad</h2>
              <p>More info about us</p>
            </div>
            <ExternalLinkIcon className="text-muted-foreground" />
          </div>
        </a>
      </div>
    </div>
  )
}
