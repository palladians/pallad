import { type SubmitHandler, useForm } from "react-hook-form"
import { runtime } from "webextension-polyfill"

const ConfirmationForm = ({ windowId }: { windowId: number }) => {
  const confirm = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: true,
    })
    window.close()
  }
  const decline = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: false,
    })
    window.close()
  }
  return (
    <form id="confirm-section">
      <button type="button" onClick={confirm}>
        Yes
      </button>
      <button type="button" onClick={decline}>
        No
      </button>
    </form>
  )
}

type UserInputForm = {
  userInput: string
}

const InputForm = ({
  windowId,
  inputType,
}: {
  windowId: number
  inputType: string
}) => {
  const { register, handleSubmit } = useForm<UserInputForm>()
  const onSubmit: SubmitHandler<UserInputForm> = async ({ userInput }) => {
    await runtime.sendMessage({
      windowId: windowId,
      userInput,
    })
    window.close()
  }
  const reject = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userRejected: true,
    })
    window.close()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type={inputType} {...register("userInput")} />
      <button type="submit">Submit</button>
      <button type="button" onClick={reject}>
        Cancel
      </button>
    </form>
  )
}

export const WebConnector = () => {
  const params = new URLSearchParams(window.location.search)
  const title = params.get("title")
  const payload = params.get("payload")
  const inputType = params.get("inputType")
  const rawWindowId = params.get("windowId")
  if (!rawWindowId) return null
  const windowId = Number.parseInt(rawWindowId)
  if (!inputType) return null
  return (
    <div className="flex-1 bg-background">
      <p>{title}</p>
      <p>{payload}</p>
      {inputType === "confirmation" && <ConfirmationForm windowId={windowId} />}
      {["text", "password"].includes(inputType) && (
        <InputForm inputType={inputType} windowId={windowId} />
      )}
    </div>
  )
}
