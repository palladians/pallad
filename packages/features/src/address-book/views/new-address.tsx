import { AppLayout } from "@/components/app-layout"
import { useEffect } from "react"

import { MenuBar } from "@/components/menu-bar"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import { NewAddressFormSchema } from "../components/new-address-form.schema"

type NewAddressViewProps = {
  onGoBack: () => void
  onSubmit: (contact: { name: string; address: string }) => void
}

export const NewAddressView = ({ onGoBack, onSubmit }: NewAddressViewProps) => {
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(NewAddressFormSchema),
    defaultValues: { name: "", address: "" },
  })
  const disableSubmit = watch(["name", "address"]).includes("")
  // biome-ignore lint: only first render
  useEffect(() => {
    setValue("address", location.state?.address || "")
  }, [])
  return (
    <AppLayout>
      <div className="pb-12 bg-secondary rounded-b-2xl">
        <MenuBar variant="back" onBackClicked={onGoBack} />
        <h2 className="ml-8 mt-1 text-3xl">New contact</h2>
      </div>
      <div className="pt-6 pb-8 px-8 flex flex-col flex-1">
        <form
          className="flex flex-col flex-1 items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full space-y-2">
            <div className="space-y-0.5">
              <input
                type="text"
                className={clsx(
                  "w-full input",
                  errors.name && "input-bordered input-error",
                )}
                placeholder="Name"
                data-testid="newAddress/nameInput"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-0.5">
              <input
                type="text"
                className={clsx(
                  "w-full input",
                  errors.name && "input-bordered input-error",
                )}
                placeholder="Address (B62...)"
                data-testid="newAddress/addressInput"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-red-400">{errors.address.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-auto px-12 btn btn-primary"
            disabled={disableSubmit}
            data-testid="submitForm"
          >
            Add contact
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
