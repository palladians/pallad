type ConfirmationFormProps = {
  onConfirm: () => void
  onDecline: () => void
}

export const ConfirmationForm = ({
  onConfirm,
  onDecline,
}: ConfirmationFormProps) => {
  return (
    <form
      id="confirm-section"
      className="flex flex-1 flex-col items-center gap-2"
    >
      <button
        className="btn btn-primary max-w-48 w-full"
        type="button"
        onClick={onConfirm}
      >
        Approve
      </button>
      <button className="btn max-w-48 w-full" type="button" onClick={onDecline}>
        Deny
      </button>
    </form>
  )
}
