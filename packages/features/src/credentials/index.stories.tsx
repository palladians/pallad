import type { StoryDefault } from "@ladle/react"
import { CredentialDetailsRoute } from "./routes/credential-details"
import { CredentialsRoute } from "./routes/credentials"

export const Credentials = () => <CredentialsRoute />

export const CredentialDetails = () => <CredentialDetailsRoute />

export default {
  title: "Credentials",
} satisfies StoryDefault
