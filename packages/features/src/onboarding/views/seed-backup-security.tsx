import { SecurityCheck } from "@/onboarding/components/security-check"

type ImportConfirmationViewProps = {
  onConfirm: () => void
}

export const SeedBackupSecurityView = ({
  onConfirm,
}: ImportConfirmationViewProps) => {
  return <SecurityCheck title="Seed backup" onConfirm={onConfirm} />
}
