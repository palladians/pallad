import { useAppStore } from "@/common/store/app"
import { useNavigate } from "react-router-dom"
import { PrivacyView } from "../views/privacy"

export const PrivacyRoute = () => {
  const navigate = useNavigate()
  const shareData = useAppStore((state) => state.shareData)
  const setShareData = useAppStore((state) => state.setShareData)
  return (
    <PrivacyView
      onCloseClicked={() => navigate(-1)}
      shareData={shareData}
      setShareData={setShareData}
    />
  )
}
