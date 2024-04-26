import { Mina } from "@palladxyz/mina-core"
import { AlertCircleIcon } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { RestartWalletAlert } from "@/components/restart-wallet-alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ViewHeading } from "@/components/view-heading"

type SettingsViewProps = {
  onGoBack: () => void
  restartAlertVisible: boolean
  setRestartAlertVisible: (visible: boolean) => void
  network: string
  theme: string
  setTheme: (theme: string) => void
  shareData: boolean
  setShareData: (shareData: boolean) => void
}

export const SettingsView = ({
  onGoBack,
  restartAlertVisible,
  setRestartAlertVisible,
  network,
  theme,
  setTheme,
  shareData,
  setShareData,
}: SettingsViewProps) => (
  <AppLayout>
    <RestartWalletAlert
      open={restartAlertVisible}
      setOpen={setRestartAlertVisible}
    />
    <div className="flex flex-col flex-1">
      <ViewHeading title="Settings" backButton={{ onClick: onGoBack }} />
      <div className="flex flex-col gap-4 p-4 flex-1">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Network</h2>
          <RadioGroup value={network}>
            {/* TODO: Enable after Public Beta <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={
                    Mina.Networks[
                      Mina.Networks.MAINNET.toUpperCase() as keyof typeof Mina.Networks
                    ]
                  }
                  id="networkMainnet"
                />
                <Label htmlFor="networkMainnet">Mainnet</Label>
              </div> */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={
                  Mina.Networks[
                    Mina.Networks.BERKELEY.toUpperCase() as keyof typeof Mina.Networks
                  ]
                }
                id="networkBerkeley"
              />
              <Label htmlFor="networkBerkeley">Berkeley</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={
                  Mina.Networks[
                    Mina.Networks.TESTWORLD.toUpperCase() as keyof typeof Mina.Networks
                  ]
                }
                id="networkBerkeley"
              />
              <Label htmlFor="networkBerkeley">TestWorld 2.0</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Theme</h2>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="themeLight" />
              <Label htmlFor="themeLight">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="themeDark" />
              <Label htmlFor="themeDark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="themeSystem" />
              <Label htmlFor="themeSystem">System</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Privacy</h2>
          <div className="flex items-center gap-2">
            <Switch
              checked={shareData}
              onCheckedChange={(value) => setShareData(value)}
            />
            <Label>Share anonymous data</Label>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-semibold">Danger Zone</h2>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => setRestartAlertVisible(true)}
            data-testid="settings__restartWallet"
          >
            <AlertCircleIcon size={16} />
            Restart Wallet
          </Button>
        </div>
      </div>
    </div>
  </AppLayout>
)
