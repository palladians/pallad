'use client'
import { Button } from '@palladxyz/ui'
import { CheckCircleIcon } from 'lucide-react'
import NextLink from 'next/link'

const SuccessPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-48">
      <div className="flex gap-8 max-w-lg">
        <CheckCircleIcon size={56} className="text-teal-500" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Success!</h2>
          <p className="leading-8">
            You have been successfully added to the waitlist. Watch out for the
            Closed Beta invitation.
          </p>
          <div>
            <NextLink href="/">
              <Button>Go to Home</Button>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
