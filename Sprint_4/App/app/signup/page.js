'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/app/components/home/Navbar'
import Footer from '@/app/components/home/Footer'
import SignupForm from '@/app/components/auth/SignupForm'
import LoadingSpinner from '@/app/components/auth/LoadingSpinner'
import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper'

export default function Signup() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
        <AuthFormWrapper title="Create Your Account">
          <SignupForm />
        </AuthFormWrapper>
      </main>
      <Footer />
    </div>
  )
}
