import type { FallbackProps } from "react-error-boundary"
import { useTranslation } from "react-i18next"
import { useMixpanel } from "react-mixpanel-browser"

export const ErrorView = ({ error, resetErrorBoundary }: FallbackProps) => {
  const mixpanel = useMixpanel()
  const stringifiedError = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error),
  )
  const report = async () => {
    await mixpanel.track("Boundary Error", { error: stringifiedError })
    resetErrorBoundary()
  }
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col justify-center items-center min-h-screen w-full p-8">
      <div className="card flex flex-col flex-1 bg-secondary w-full">
        <div className="card-body flex-1 flex flex-col gap-4 p-4">
          <h1 className="text-xl">Woops</h1>
          <p className="flex-[0] text-gray-400">{t("errorHappend")}</p>
          <a
            href="https://get.pallad.co/status"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t("checkServiceStatus")}
          </a>
          <textarea
            className="textarea textarea-bordered rounded-xl resize-none flex-1"
            value={stringifiedError}
            readOnly
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn bg-neutral flex-1"
              onClick={resetErrorBoundary}
            >
              {t("tryAgain")}
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={report}
            >
              {t("sendReport")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
