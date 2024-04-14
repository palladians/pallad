import { StoryDefault } from '@ladle/react'

import { AboutView } from './about'

export const View = () => <AboutView onGoBack={() => console.log('go back')} />

export default {
  title: 'Dashboard / About'
} satisfies StoryDefault
