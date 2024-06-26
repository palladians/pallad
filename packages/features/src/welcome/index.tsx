import { clsx } from "clsx"
import { ExternalLinkIcon } from "lucide-react"

import Logo from "@/common/assets/logo.svg?react"
import QuestionIcon from "@/common/assets/question.svg?react"

const SHORTCUT_CLICKED = false

export const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex bg-secondary justify-center items-center">
      <div className="flex z-10 flex-col gap-4 w-[370px] h-[600px] bg-neutral rounded-lg shadow-lg p-8">
        <div className="flex flex-1 flex-col justify-center items-center gap-4">
          <Logo className="text-primary" width={100} height={100} />
          <h1 className="text-3xl">Ready to open</h1>
          <p className="text-center text-mint text-md">
            Just click on the Pallad icon in your extensions
          </p>
          <p className="text-[#7D7A9C]">or use this handy shortcut</p>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className={clsx(
                "btn",
                SHORTCUT_CLICKED ? "btn-primary" : "btn-accent",
              )}
            >
              option
            </button>
            <button
              type="button"
              className={clsx(
                "btn btn-outline",
                SHORTCUT_CLICKED ? "btn-primary" : "btn-accent",
              )}
            >
              shift
            </button>
            <button
              type="button"
              className={clsx(
                "btn btn-outline px-6",
                SHORTCUT_CLICKED ? "btn-primary" : "btn-accent",
              )}
            >
              P
            </button>
          </div>
        </div>
        <a
          href="https://get.pallad.co/website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex bg-secondary rounded-md p-4 gap-4 items-center">
            <div className="bg-neutral p-3 rounded-full">
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
