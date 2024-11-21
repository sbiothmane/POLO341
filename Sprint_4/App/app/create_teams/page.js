// pages/create_teams.js or app/create_teams/page.js
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '@/app/components/home/AnimatedBackground'
import Navbar from '@/app/components/home/Navbar'
import Footer from '@/app/components/home/Footer'
import CreateTeamForm from '@/app/components/create-team/CreateTeamForm'
import { Loader2 } from 'lucide-react'

export default function CreateTeamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  if (session && session.user.role === 'instructor') {
    return (
      <div className="min-h-screen text-gray-800 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <AnimatedBackground />
        <Navbar />
        <main className="pt-24 relative z-10">
          <section className="py-20">
            <div className="container mx-auto px-6">
              <CreateTeamForm session={session} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <p className="text-red-500 text-center mt-8">
      You are not authorized to access this page.
    </p>
  )
}
