import type { FallbackProps } from "react-error-boundary"
import { useMixpanel } from "react-mixpanel-browser"

export const ErrorView = ({ error, resetErrorBoundary }: FallbackProps) => {
  const mixpanel = useMixpanel()
  const stringifiedError = JSON.stringify(
    error,
    Object.getOwnPropertyNames(error),
  )
  const report = async () => {
    await mixpanel.track("Boundary Error", { error: stringifiedError })
    resetErrorBoundary()
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-8">
      <div className="card bg-secondary w-full">
        <div className="card-body gap-4 p-4">
          <h1 className="card-title">Woops</h1>
          <p>An error happened.</p>
          <textarea
            className="textarea textarea-bordered rounded-xl resize-none"
            value={stringifiedError}
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn bg-neutral flex-1"
              onClick={resetErrorBoundary}
            >
              Try Again
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={report}
            >
              Send Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
