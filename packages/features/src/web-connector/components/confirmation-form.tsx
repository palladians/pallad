import { useTranslation } from "react-i18next"

type ConfirmationFormProps = {
  onConfirm: () => void
  onDecline: () => void
  loading: boolean
}

export const ConfirmationForm = ({
  onConfirm,
  onDecline,
  loading,
}: ConfirmationFormProps) => {
  const { t } = useTranslation()
  return (
    <form
      id="confirm-section"
      className="flex flex-1 flex-col items-center gap-2"
    >
      <button
        className="btn btn-primary max-w-48 w-full"
        type="button"
        disabled={loading}
        onClick={onConfirm}
      >
        {t("approve")}
      </button>
      <button
        className="btn max-w-48 w-full"
        type="button"
        onClick={onDecline}
        disabled={loading}
      >
        {t("deny")}
      </button>
    </form>
  )
}
