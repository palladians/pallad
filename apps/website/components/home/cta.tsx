'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@palladxyz/ui'
import { clsx } from 'clsx'
import { MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const WAITLIST_URL =
  'https://pocketbase.sh.palladians.xyz/api/collections/waitlist/records'

const WaitlistSchema = z.object({
  email: z.string().email()
})

type WaitlistData = z.infer<typeof WaitlistSchema>

export const Cta = () => {
  const router = useRouter()
  const [submitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(WaitlistSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: WaitlistData) => {
    await fetch(WAITLIST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        waitlist_id: 9604
      })
    })
    router.push('/success')
  }

  return (
    <section className="relative py-40 overflow-hidden" id="waitlist">
      <div className="absolute w-[800px] h-[600px] bg-cyan-500/5 blur-[64px] rounded-full right-0 top-0" />
      <div className="absolute w-[800px] h-[600px] bg-indigo-500/5 blur-[64px] rounded-full left-0 -top-24" />
      <div className="relative flex flex-col max-w-md mx-auto text-center gap-8">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Get Started now</h2>
          <p className="leading-8">
            Join Pallad's waitlist to earn access before the official launch and
            explore it.
          </p>
        </div>
        {submitted ? (
          <div className="flex gap-4 items-center justify-center">
            <MailIcon size={32} />
            <p className="text-lg">👀 Please check your email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <Input
              placeholder="Email Address"
              {...register('email')}
              className={clsx([errors.email && 'border-2 border-rose-500'])}
            />
            <Button type="submit" className="whitespace-nowrap">
              Join Waitlist
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
