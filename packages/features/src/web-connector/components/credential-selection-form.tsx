import React, { useState } from "react"
import { useTranslation } from "react-i18next"

type SelectionFormProps = {
  onSubmit: (selectedCredentials: string) => void
  onReject: () => void
  submitButtonLabel?: string
  rejectButtonLabel?: string
  payload: string
  loading: boolean
}

export const SelectionForm = ({
  onSubmit,
  onReject,
  submitButtonLabel,
  rejectButtonLabel,
  payload,
  loading,
}: SelectionFormProps) => {
  const { t } = useTranslation()
  const [selectedCredentials, setSelectedCredentials] = useState<any[]>([])

  const credentials = React.useMemo(() => {
    try {
      const parsedCredentials = JSON.parse(payload) as any[]
      return parsedCredentials.map((credential) => ({
        id: Buffer.from(JSON.stringify(credential)).toString("base64"),
        credential,
      }))
    } catch {
      return []
    }
  }, [payload])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(JSON.stringify(selectedCredentials.map((c) => c.credential)))
  }

  const handleToggleCredential = (credentialData: any) => {
    setSelectedCredentials((prev) =>
      prev.some((c) => c.id === credentialData.id)
        ? prev.filter((c) => c.id !== credentialData.id)
        : [...prev, credentialData],
    )
  }

  const isSelected = (credentialData: any) => {
    return selectedCredentials.some((c) => c.id === credentialData.id)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col items-center gap-2 w-full"
    >
      <div className="w-full overflow-y-auto max-h-48 flex flex-col gap-2">
        {credentials.map((credentialData) => (
          <label
            key={credentialData.id}
            className="flex items-center gap-2 p-3 rounded-lg bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={isSelected(credentialData)}
              onChange={() => handleToggleCredential(credentialData)}
              disabled={loading}
            />
            <span className="font-medium">
              {credentialData.credential.witness?.type || "Unknown Credential"}
            </span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
        disabled={loading || selectedCredentials.length === 0}
      >
        {submitButtonLabel ?? t("webConnector.continue")}
      </button>

      <button
        type="button"
        className="btn max-w-48 w-full"
        onClick={onReject}
        disabled={loading}
      >
        {rejectButtonLabel ?? t("webConnector.reject")}
      </button>
    </form>
  )
}
