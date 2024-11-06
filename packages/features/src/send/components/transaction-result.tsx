import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Link } from "react-router-dom"

type TxResult = {
  label: string
  content: string
}

type TxButton = {
  label: string
  onClick: () => void
}

interface TransactionResultProps {
  title: string
  result: TxResult
  button: TxButton
}

export const TransactionResult = ({
  title,
  result,
  button,
}: TransactionResultProps) => {
  return (
    <AppLayout>
      <MenuBar variant="stop" onCloseClicked={button.onClick} />
      <div className="flex flex-col flex-1 items-center text-center">
        <h1 className="text-3xl max-w-80">{title}</h1>
        <div className="flex flex-col flex-1 justify-center items-center w-full p-8 gap-2">
          <p className="label text-lg">{result.label}</p>
          <div className="card bg-secondary w-full py-6 px-4 text-sm break-all">
            {result.content}
          </div>
        </div>
        <div className="flex flex-col items-center p-4 gap-2 w-full">
          <Link
            to="/dashboard"
            type="button"
            className="btn btn-primary max-w-48 w-full"
            onClick={button.onClick}
            data-testid="result/close"
          >
            Close
          </Link>
          <button
            type="button"
            className="btn max-w-48 w-full"
            onClick={button.onClick}
            data-testid="formSubmit"
          >
            {button.label}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
