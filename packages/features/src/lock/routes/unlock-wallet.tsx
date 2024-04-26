import { zodResolver } from "@hookform/resolvers/zod"
import {
  getSecurePersistence,
  getSessionPersistence,
} from "@palladxyz/persistence"
import { useVault } from "@palladxyz/vault"
import { type FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { passwordSchema } from "@/common/lib/validation"

import { UnlockWalletView } from "../views/unlock-wallet"

const formSchema = z.object({
  spendingPassword: passwordSchema,
})

export const UnlockWalletRoute = () => {
  const [restartAlertVisible, setRestartAlertVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const unlockWalletForm = useForm({
    defaultValues: {
      spendingPassword: "",
    },
    resolver: zodResolver(formSchema),
  })
  const onSubmit = async ({
    spendingPassword,
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem("spendingPassword", spendingPassword)
    await useVault.persist.rehydrate()
    setTimeout(() => {
      unlockWalletForm.setError("spendingPassword", {
        type: "wrongPassword",
        message: "The spending password is wrong",
      })
    }, 100)
  }
  const togglePassword = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowPassword(!showPassword)
  }
  // biome-ignore lint: won't update
  useEffect(() => {
    const unsub = useVault.persist?.onFinishHydration(async () => {
      const authenticated =
        (await getSecurePersistence().getItem("foo")) === "bar"
      if (!authenticated) {
        await getSessionPersistence().removeItem("spendingPassword")
        return unlockWalletForm.setError("spendingPassword", {
          type: "wrongPassword",
          message: "The spending password is wrong",
        })
      }
      navigate("/dashboard")
    })
    return () => unsub?.()
  }, [])
  return (
    <UnlockWalletView
      form={unlockWalletForm}
      onSubmit={onSubmit}
      restartAlertVisible={restartAlertVisible}
      setRestartAlertVisible={setRestartAlertVisible}
      showPassword={showPassword}
      togglePassword={togglePassword}
    />
  )
}
