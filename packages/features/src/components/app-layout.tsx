import type React from "react"

// import { useAccount } from "@/common/hooks/use-account";

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  // const { lockWallet } = useAccount();
  // const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);
  return (
    <div
      className="flex flex-col flex-1 bg-background gap-4"
      data-testid="appLayout"
    >
      <div className="animate-in fade-in flex flex-1">{children}</div>
    </div>
  )
}
