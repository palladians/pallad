import { AddEditAccountView } from "../views/add-edit-account"

export const EditAccountRoute = () => {
  return (
    <AddEditAccountView
      account={{
        name: "",
        publicKey: "",
      }}
      title={"Edit Account"}
    />
  )
}
