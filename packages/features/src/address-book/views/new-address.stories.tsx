import { StoryDefault } from '@ladle/react'

import { NewAddressView } from './new-address'

export const View = () => (
  <NewAddressView onGoBack={() => console.log('back')} />
)

export default {
  title: 'Dashboard / Address Book/ New Address'
} satisfies StoryDefault
