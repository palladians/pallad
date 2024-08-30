import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { useTranslation } from "react-i18next"

import { useAddressBookStore } from "@/common/store/address-book"
import { FormError } from "@/components/form-error"

import { NewAddressFormSchema } from "./new-address-form.schema"

export const NewAddressForm = () => {
  const navigate = useNavigate()
  const addContact = useAddressBookStore((state) => state.addContact)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewAddressFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  })
  const onSubmit = (data: Record<string, string>) => {
    addContact(data)
    return navigate("/contacts")
  }

  const { t } = useTranslation()
  return (
    <form
      className="flex flex-col flex-1 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="gap-2">
        <label
          htmlFor="contactName"
          className={cn(errors.name && "text-destructive")}
        >
          {t("contact-name")}
        </label>
        <input
          id="contactName"
          placeholder="Name"
          data-testid="newAddress/nameInput"
          className={cn(errors.name && "border-destructive")}
          {...register("name")}
        />
        <FormError>{errors.name?.message}</FormError>
      </div>
      <div className="gap-2 flex-1">
        <label
          htmlFor="contactAddress"
          className={cn(errors.address && "text-destructive")}
        >
          {t("receiver-address")}
        </label>
        <input
          id="contactAddress"
          placeholder="B62XXXXXXXXXXXX"
          data-testid="newAddress/addressInput"
          className={cn(errors.address && "border-destructive")}
          {...register("address")}
        />
        <FormError>{errors.address?.message}</FormError>
      </div>
      <button
        type="submit"
        className="group gap-2"
        data-testid="newAddress/createButton"
      >
        <PlusIcon size={16} />
        <span>{t("create-contact")}</span>
      </button>
    </form>
  )
}
