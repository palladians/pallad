import { useNavigate } from "react-router-dom"
import { SeedBackupSecurityView } from "../views/seed-backup-security"

export const SeedBackupSecurityRoute = () => {
  const navigate = useNavigate()
  return (
    <SeedBackupSecurityView onConfirm={() => navigate("/onboarding/backup")} />
  )
}
