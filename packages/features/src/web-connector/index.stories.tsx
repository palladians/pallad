import { type StoryDefault, action } from "@ladle/react"
import { WebConnectorView } from "./views/web-connector"

export const Enable = () => {
  return (
    <WebConnectorView
      inputType="confirmation"
      onConfirm={action("Confirm")}
      onDecline={action("Decline")}
      onReject={action("Reject")}
      title="Connection request"
      payload="{}"
      onSubmit={action("Submit")}
    />
  )
}

export default {
  title: "WebConnector",
} satisfies StoryDefault
