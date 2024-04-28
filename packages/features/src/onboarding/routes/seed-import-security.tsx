import { useNavigate } from "react-router-dom"
import { SeedImportSecurityView } from "../views/seed-import-security"

export const SeedImportSecurityRoute = () => {
  const navigate = useNavigate()
  return (
    <SeedImportSecurityView onConfirm={() => navigate("/onboarding/import")} />
  )
}
