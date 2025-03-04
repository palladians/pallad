import { useVault } from "@palladxyz/vault"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Account } from "../types"
import { AccountManagementView } from "../views/account-management"

export const AccountManagementRoute = () => {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState<Account[]>([])
  const { knownAccounts, deriveNewAccount } = useVault()

  const mapArrayToObject = useCallback((array: string[]): Account[] => {
    return array.map((item, index) => ({
      name: `account ${index}`,
      publicKey: item,
    }))
  }, [])

  useEffect(() => {
    setAccounts(mapArrayToObject(knownAccounts))
  }, [knownAccounts, mapArrayToObject])

  useEffect(() => {
    const x = async () => {
      await deriveNewAccount()
    }
    x()
  }, [deriveNewAccount])

  return (
    <AccountManagementView
      onGoBack={() => navigate(-1)}
      walletName={"TEST 1"}
      accounts={accounts}
    />
  )
}
