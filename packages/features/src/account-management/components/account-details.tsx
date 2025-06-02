import { truncateString } from "@/common/lib/string"
import { LogoButton } from "@/components/menu-bar"
import { MinaKeyConst } from "@palladco/key-management"
import { type SingleCredentialState, useVault } from "@palladco/vault"
import { EyeOff, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { DetailsDropdown } from "./details-dropdown"

type AccountDetailsProps = {
  account: SingleCredentialState
  onCopyWalletAddress: () => void
}

function getDerivationPath(accountIndex: number, addressIndex: number) {
  return `m/${MinaKeyConst.PURPOSE}'/${MinaKeyConst.MINA_COIN_TYPE}'/${accountIndex}'/0/${addressIndex}`
}

export const AccountDetails = ({
  account,
  onCopyWalletAddress,
}: AccountDetailsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    removeCredential,
    credentials,
    setCredential,
    updateCurrentWallet,
    keyAgentName,
  } = useVault()

  const dropdownOptions = [
    {
      name: t("accountManagement.remove"),
      icon: <EyeOff className="w-4 h-4" />,
      onClick: async (account: SingleCredentialState) => {
        const serializedList = Object.values(credentials)
        if (
          account.credential?.accountIndex === 0 ||
          account.credential?.addressIndex === 0
        ) {
          toast.error(t("accountManagement.cannotRemoveFirstCredential"))
          return
        }

        if (
          account.credential?.accountIndex === serializedList.length - 1 &&
          serializedList.length > 1
        ) {
          removeCredential(account?.credentialName)
          setCredential(serializedList[0])
          updateCurrentWallet({
            keyAgentName,
            credentialName: serializedList[0]?.credentialName,
            currentAccountIndex:
              serializedList[0]?.credential?.accountIndex ?? 0,
            currentAddressIndex:
              serializedList[0]?.credential?.addressIndex ?? 0,
          })
          toast.success(t("accountManagement.accountRemoved"))
        } else {
          toast.error(t("accountManagement.onlyLastCredentialCanBeRemoved"))
        }
      },
    },
    {
      name: t("accountManagement.edit"),
      icon: <Pencil className="w-4 h-4" />,
      onClick: async (account: SingleCredentialState) => {
        navigate(`/accounts/edit/${account.credential?.addressIndex}`)
      },
    },
  ]

  return (
    <div className="flex flex-col text-center justify-center items-center space-y-8 card bg-accent p-3">
      <nav className="flex justify-between w-full relative">
        <div>
          <LogoButton onClick={() => {}} color={"#191725"} />
        </div>
        <DetailsDropdown options={dropdownOptions} account={account} />
      </nav>
      <div className="flex w-full justify-between">
        <div className="flex flex-col py-3 justify-end items-start text-left">
          <div className="text-xl text-secondary">
            {account?.credentialName &&
              truncateString({
                value: account?.credentialName,
                endCharCount: 1,
                firstCharCount: 12,
              })}
          </div>
          <div className="text-xl text-secondary">
            {account?.credentialName &&
              truncateString({
                value: account?.credential?.address ?? "",
                endCharCount: 3,
                firstCharCount: 5,
              })}
          </div>
          <div className="text-xl text-secondary">
            {getDerivationPath(
              account?.credential?.accountIndex ?? 0,
              account?.credential?.addressIndex ?? 0,
            )}
          </div>
        </div>
        {account?.credential?.address && (
          <QRCode
            value={account?.credential?.address}
            bgColor={"#25233A"}
            fgColor={"#D1B4F4"}
            className="relative w-[120px] h-[120px]"
            onClick={() => {
              onCopyWalletAddress()
            }}
          />
        )}
      </div>
    </div>
  )
}
