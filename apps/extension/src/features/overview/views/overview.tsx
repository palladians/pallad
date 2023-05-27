import { Button } from '@palladxyz/ui'

export const OverviewView = () => {
  const openNewTab = () => {
    console.log('>>>OPEN')
    chrome.tabs.create({ url: 'app.html' })
  }
  return (
    <div>
      <Button onPress={openNewTab}>Send something</Button>
      <Button variant="destructive">Destroy something</Button>
    </div>
  )
}
