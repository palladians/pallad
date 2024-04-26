import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const WelcomeScreen = () => {
  return (
    <div className="relative flex flex-1 bg-slate-800 items-center justify-center">
      <div className="z-0 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <img
          src="/intro.png"
          width={600}
          height={800}
          className="opacity-20 rotate-45"
          alt="Welcome to Pallad"
        />
      </div>
      <div className="flex z-10 flex-col gap-4 w-[370px] h-[600px] bg-background rounded-lg shadow-lg p-8">
        <div className="flex flex-1 flex-col justify-center items-center gap-4">
          <h1 className="font-semibold text-xl">
            Pallad is installed and ready!
          </h1>
          <p className="text-center text-md">
            To access your wallet, just click on the Pallad icon in your
            extensions, or use this handy shortcut
          </p>
          <div className="flex gap-2 items-center">
            <Button>option</Button>
            <Button>shift</Button>
            <Button>P</Button>
          </div>
          <p className="text-md">to open Pallad quickly</p>
        </div>
        <a href="https://pallad.xyz" target="_blank" rel="noopener noreferrer">
          <div className="flex flex-col gap-2 bg-slate-800 rounded-lg p-4">
            <div className="flex gap-2 items-center">
              <InfoIcon size={16} />
              <h2 className="text-lg font-semibold">More info about Pallad</h2>
            </div>
            <p className="text-md">
              Learn more about how to use your wallet, updates and ecosystem
              news!
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}
