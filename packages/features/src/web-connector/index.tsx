import { SubmitHandler, useForm } from 'react-hook-form'
import { runtime } from 'webextension-polyfill'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ConfirmationForm = ({ windowId }: { windowId: number }) => {
  const confirm = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: true
    })
    window.close()
  }
  const decline = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userConfirmed: false
    })
    window.close()
  }
  return (
    <form id="confirm-section">
      <Button onClick={confirm}>Yes</Button>
      <Button onClick={decline}>No</Button>
    </form>
  )
}

type UserInputForm = {
  userInput: string
}

const InputForm = ({
  windowId,
  inputType
}: {
  windowId: number
  inputType: string
}) => {
  const { register, handleSubmit } = useForm<UserInputForm>()
  const onSubmit: SubmitHandler<UserInputForm> = async ({ userInput }) => {
    await runtime.sendMessage({
      windowId: windowId,
      userInput
    })
    window.close()
  }
  const reject = async () => {
    await runtime.sendMessage({
      windowId: windowId,
      userRejected: true
    })
    window.close()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input type={inputType} {...register('userInput')} />
      <Button type="submit">Submit</Button>
      <Button onClick={reject}>Cancel</Button>
    </form>
  )
}

export const WebConnector = () => {
  const params = new URLSearchParams(window.location.search)
  const title = params.get('title')
  const payload = params.get('payload')
  const inputType = params.get('inputType')
  const rawWindowId = params.get('windowId')
  if (!rawWindowId) return null
  const windowId = parseInt(rawWindowId)
  if (!inputType) return null
  return (
    <div className="flex-1 bg-background">
      <p>{title}</p>
      <p>{payload}</p>
      {inputType === 'confirmation' && <ConfirmationForm windowId={windowId} />}
      {['text', 'password'].includes(inputType) && (
        <InputForm inputType={inputType} windowId={windowId} />
      )}
    </div>
  )
}
