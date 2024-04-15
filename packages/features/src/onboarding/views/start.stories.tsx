import { StoryDefault } from '@ladle/react'

import { StartView } from './start'

export const View = () => (
  <StartView
    onCreateClicked={() => console.log('create')}
    onRestoreClicked={() => console.log('restore')}
  />
)

export default {
  title: 'Onboarding / Start'
} satisfies StoryDefault
