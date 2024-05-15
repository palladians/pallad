import { twc } from "react-twc"

export const FormError = twc.div`text-destructive text-sm`

FormError.displayName = "FormError"

FormError.defaultProps = {
  "data-testid": "formError",
} as never
