'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/app/components/home/Navbar'
import Footer from '@/app/components/home/Footer'
import LoginForm from '@/app/components/auth/LoginForm'
import LoadingSpinner from '@/app/components/auth/LoadingSpinner'
import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper'

export default function Login() {
  const { data: session, status } = useSession()
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
        <AuthFormWrapper title="Login to Your Account">
          <LoginForm />
        </AuthFormWrapper>
      </main>
      <Footer />
    </div>
  )
}
