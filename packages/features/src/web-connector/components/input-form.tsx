import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { UserInputForm } from "../types"

export const InputForm = ({
  onSubmit,
  onReject,
  inputType,
  loading,
}: {
  onSubmit: SubmitHandler<UserInputForm>
  onReject: () => void
  inputType: string
  loading: boolean
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit } = useForm<UserInputForm>()
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col items-center gap-2"
    >
      <label className="input flex items-center gap-2 w-full">
        <input
          id="userInput"
          type={
            inputType === "password"
              ? showPassword
                ? "text"
                : "password"
              : "text"
          }
          data-testid="webConnector/password"
          placeholder="Enter your password"
          className="grow"
          disabled={loading}
          {...register("userInput")}
        />
        {inputType === "password" && (
          <button
            type="button"
            className="btn btn-link -mr-4"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
          </button>
        )}
      </label>
      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
        disabled={loading}
      >
        Sign
      </button>
      <button
        type="button"
        className="btn max-w-48 w-full"
        onClick={onReject}
        disabled={loading}
      >
        Reject
      </button>
    </form>
  )
}
