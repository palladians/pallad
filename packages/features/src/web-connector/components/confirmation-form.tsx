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
        Approve
      </button>
      <button
        className="btn max-w-48 w-full"
        type="button"
        onClick={onDecline}
        disabled={loading}
      >
        Deny
      </button>
    </form>
  )
}
