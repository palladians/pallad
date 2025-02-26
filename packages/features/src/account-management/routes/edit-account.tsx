import { EditAccountView } from "../views/edit-account"

export const EditAccountRoute = () => {
  return (
    <EditAccountView
      account={{
        name: "",
        publicKey: "",
      }}
      onSubmit={(account: string): void => {
        console.log(account)
      }}
    />
  )
}
