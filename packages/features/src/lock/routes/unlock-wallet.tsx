import { zodResolver } from "@hookform/resolvers/zod"
import { securePersistence, sessionPersistence } from "@palladco/vault"
import { useVault } from "@palladco/vault"
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
  const [formSubmitted, setFormSubmitted] = useState(false)
  const navigate = useNavigate()
  const unlockWalletForm = useForm({
    defaultValues: {
      spendingPassword: "",
    },
    resolver: zodResolver(formSchema as any),
  })
  const onSubmit = async ({
    spendingPassword,
  }: {
    spendingPassword: string
  }) => {
    setFormSubmitted(true)
    await sessionPersistence.setItem("spendingPassword", spendingPassword)
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
      if (!formSubmitted) return
      const authenticated = (await securePersistence.getItem("foo")) === "bar"
      if (!authenticated) {
        await sessionPersistence.removeItem("spendingPassword")
        return unlockWalletForm.setError("spendingPassword", {
          type: "wrongPassword",
          message: "The spending password is wrong",
        })
      }
      navigate("/dashboard")
    })
    return () => unsub?.()
  }, [formSubmitted])
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
