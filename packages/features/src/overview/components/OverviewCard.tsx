import { useFiatPrice } from '@palladxyz/offchain-data'
import {
  Avatar,
  AvatarFallback,
  Button,
  Label,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@palladxyz/ui'
import easyMeshGradient from 'easy-mesh-gradient'
import { CopyIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAccount } from '../../common/hooks/useAccount'
import { truncateString } from '../../common/lib/string'
import { useWallet } from '../../wallet/hooks/useWallet'

export const OverviewCard = () => {
  const { wallet, copyWalletAddress } = useWallet()
  const walletAddress = wallet.getCurrentWallet()?.address
  const navigate = useNavigate()
  const { isLoading: accountLoading, minaBalance } = useAccount()
  const { data: fiatPriceData, isLoading: priceLoading } = useFiatPrice()
  const overviewLoading = accountLoading || priceLoading
  const fiatBalance = useMemo(() => {
    if (!minaBalance) return
    const rawFiatPrice = fiatPriceData?.['mina-protocol']?.usd || 0
    if (!rawFiatPrice) return
    return Number(minaBalance) * rawFiatPrice
  }, [minaBalance, fiatPriceData])
  const meshGradientBright = easyMeshGradient({
    seed: walletAddress,
    hueRange: [180, 240]
  })
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[16px] gap-4 p-[2px] relative"
      style={{ backgroundImage: meshGradientBright }}
    >
      <div
        className="absolute h-full w-full opacity-25 rounded-[14px] pointer-events-none"
        style={{ backgroundImage: meshGradientBright }}
      />
      <div className="flex flex-col flex-1 w-full gap-4 bg-background rounded-[14px] py-4 px-4 backdrop-blur-2xl">
        {overviewLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <Skeleton className="h-4" />
          </div>
        ) : (
          <div className="flex flex-1">
            <div className="flex flex-col flex-1 gap-2">
              <div
                className="text-lg font-semibold"
                data-testid="dashboard__minaBalance"
              >
                {minaBalance?.toString()} MINA
              </div>
              <div className="text-sm font-semibold">
                ~{fiatBalance?.toFixed(4)} USD
              </div>
            </div>
            <Avatar>
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label>Address</Label>
          <div className="flex items-center gap-2">
            <div
              className="text-sm font-semibold text-sky-400"
              data-testid="dashboard__addressTruncated"
            >
              {walletAddress &&
                truncateString({
                  value: walletAddress,
                  firstCharCount: 8,
                  endCharCount: 8
                })}
            </div>
            <Tooltip>
              <TooltipTrigger>
                <a onClick={copyWalletAddress} className="cursor-pointer">
                  <CopyIcon size={16} />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Address</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => navigate('/send')}
          >
            Send
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={() => navigate('/receive')}
          >
            Receive
          </Button>
        </div>
      </div>
    </div>
  )
}
