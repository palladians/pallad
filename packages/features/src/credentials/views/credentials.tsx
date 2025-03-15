import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import type { Json } from "@mina-js/utils"
import { IdCard } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type CredentialsViewProps = {
  credentials: [string, Json][]
}

export const CredentialsView = ({ credentials }: CredentialsViewProps) => {
  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="dashboard" />
      <section className="flex flex-col gap-4 px-8">
        <h1 className="text-3xl w-full">{t("credentials.credentials")}</h1>
        <div className="flex flex-col gap-2">
          {credentials.map(([id]) => (
            <Link
              key={id}
              to={`/credentials/${id}`}
              className="p-4 flex items-center space-x-4 bg-secondary rounded-2xl"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral">
                <IdCard />
              </div>
              <div>
                <p>{id}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  )
}
