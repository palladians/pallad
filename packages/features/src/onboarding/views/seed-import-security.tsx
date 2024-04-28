import { SecurityCheck } from "@/onboarding/components/security-check"

type ImportConfirmationViewProps = {
  onConfirm: () => void
}

export const SeedImportSecurityView = ({
  onConfirm,
}: ImportConfirmationViewProps) => {
  return <SecurityCheck title="Seed import" onConfirm={onConfirm} />
}
