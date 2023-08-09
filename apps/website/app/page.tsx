import { About } from '@/components/home/about'
import { Cta } from '@/components/home/cta'
import { Hero } from '@/components/home/hero'
import { Summary } from '@/components/home/summary'

export const metadata = {
  title: 'Home - Pallad'
}

const IndexPage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Summary />
      <About />
      <Cta />
    </div>
  )
}

export default IndexPage
