import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import { AlertCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { useAppStore } from '@/common/store/app'
import { AppLayout } from '@/components/app-layout'
import { RestartWalletAlert } from '@/components/restart-wallet-alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { ViewHeading } from '@/components/view-heading'

export const SettingsView = () => {
  const [restartAlertVisible, setRestartAlertVisible] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const switchNetwork = useVault((state) => state.switchNetwork)
  const { setTheme, theme } = useTheme()
  const { mutate } = useSWRConfig()
  const { network, shareData, setShareData } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network,
    shareData: state.shareData,
    setShareData: state.setShareData
  }))
  const handleNetworkSwitch = async (value: Mina.Networks) => {
    await switchNetwork(value)
    await mutate(() => true, undefined, { revalidate: false })
    toast({
      title: `Network has been changed to ${
        Mina.Networks[value.toUpperCase() as keyof typeof Mina.Networks]
      }`
    })
  }
  const handleThemeSwitch = async (value: string) => {
    setTheme(value)
    toast({
      title: `Theme has been changed.`
    })
  }
  return (
    <AppLayout>
      <RestartWalletAlert
        open={restartAlertVisible}
        setOpen={setRestartAlertVisible}
      />
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Settings"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col gap-4 p-4 flex-1">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Network</h2>
            <RadioGroup value={network} onValueChange={handleNetworkSwitch}>
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
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={
                    Mina.Networks[
                      Mina.Networks.TESTWORLD.toUpperCase() as keyof typeof Mina.Networks
                    ]
                  }
                  id="networkBerkeley"
                />
                <Label htmlFor="networkBerkeley">TestWorld 2.0</Label>
              </div> */}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">Theme</h2>
            <RadioGroup value={theme} onValueChange={handleThemeSwitch}>
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
}
