import { CheckIcon, CircleSlash } from 'lucide-react'
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

const EnableRequestForm = ({
  windowId,
  origin
}: {
  windowId: number
  origin: string
}) => {
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

  // Define styles

  const websiteNameStyle = {
    fontSize: '1.2em',
    marginBottom: '20px'
  }

  const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    margin: '10px 0'
  }

  const listItemTextStyle: React.CSSProperties = {
    marginLeft: '8px'
  }

  const originTextStyle: React.CSSProperties = {
    fontWeight: 'bold'
  }

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  }

  const buttonStyle = {
    flex: '1',
    margin: '0 10px'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '2em',
    paddingTop: '20px',
    paddingLeft: '20px',
    textAlign: 'left',
    fontWeight: 'bold'
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  }

  const permissionsListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0',
    textAlign: 'center',
    margin: '20px 0'
  }

  return (
    <div id="enable-request-section" style={sectionStyle}>
      <h1 style={titleStyle}>Connection request</h1>
      <p style={websiteNameStyle}>
        <span style={originTextStyle}>
          {new URL(origin).hostname.replace(/^www\./, '')}
        </span>{' '}
        wants to connect to your extension. Only continue if you trust this
        website.
      </p>
      <ul style={permissionsListStyle}>
        <li style={listItemStyle}>
          <CheckIcon />
          <span style={listItemTextStyle}>
            Let it see your wallet balance and addresses
          </span>
        </li>
        <li style={listItemStyle}>
          <CheckIcon />
          <span style={listItemTextStyle}>
            Let it send you requests for various operations
          </span>
        </li>
        <li style={listItemStyle}>
          <CircleSlash />
          <span style={listItemTextStyle}>
            It cannot move funds without your permission
          </span>
        </li>
      </ul>
      <div style={buttonGroupStyle}>
        <Button onClick={decline} style={{ ...buttonStyle }}>
          Deny
        </Button>
        <Button onClick={confirm} style={{ ...buttonStyle }}>
          Approve
        </Button>
      </div>
    </div>
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

  // Decode and parse the payload JSON
  const decodedPayload = decodeURIComponent(payload || '')
  let parsedPayload: any
  try {
    parsedPayload = JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Failed to parse payload:', error)
    return <p>Error parsing payload.</p> // Display error or handle as needed
  }

  // Define a function to render the correct form based on inputType and parsedPayload
  const renderForm = () => {
    // Determine if the payload is an 'enable' request
    const isEnableRequest =
      parsedPayload?.json?.origin && title === 'Connection request.'

    if (isEnableRequest) {
      return (
        <EnableRequestForm
          windowId={windowId}
          origin={parsedPayload.json.origin}
        />
      )
    } else if (inputType === 'confirmation') {
      return <ConfirmationForm windowId={windowId} />
    } else if (['text', 'password'].includes(inputType as string)) {
      return <InputForm inputType={inputType as string} windowId={windowId} />
    } else {
      // Function to display JSON in a readable format
      const prettyPrintJson = (json: unknown) => (
        <pre>{JSON.stringify(json, null, 2)}</pre>
      )
      return prettyPrintJson(parsedPayload)
    }
  }

  return <div className="flex-1 bg-background">{renderForm()}</div>
}
