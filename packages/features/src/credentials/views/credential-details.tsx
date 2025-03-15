import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { useTranslation } from "react-i18next"

export type CredentialDetailsViewProps = {
  id: string
  credential: string
  onGoBack: () => void
  onDelete: () => void
}

export const CredentialDetailsView = ({
  id,
  credential,
  onGoBack,
  onDelete,
}: CredentialDetailsViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="back" onBackClicked={onGoBack} />
      <section className="flex flex-col flex-1 justify-between px-8 pb-8 gap-8">
        <h1 className="text-3xl w-full">{id}</h1>
        <div className="break-all flex-1 p-4 bg-secondary rounded-xl whitespace-pre-wrap overflow-y-scroll">
          {credential}
        </div>
        <button type="button" className="btn btn-error" onClick={onDelete}>
          {t("credentials.delete")}
        </button>
      </section>
    </AppLayout>
  )
}
