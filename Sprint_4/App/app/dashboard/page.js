// pages/dashboard.js or app/dashboard/page.js
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '@/app/components/dashboard/AnimatedBackground'
import Navbar from '@/app/components/auth/Navbar' // Updated import
import Footer from '@/app/components/auth/Footer'
import UserProfile from '@/app/components/dashboard/UserProfile'
import TeamBox from '@/app/components/dashboard/TeamBox'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
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

  const { role, username } = session.user

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Navbar /> {/* Using the updated Navbar */}
      <main className="flex-grow pt-24 relative z-10">
        <UserProfile />
        <section className="py-20 bg-white/10 backdrop-blur-lg">
          <div className="container mx-auto px-6">
            {role === 'instructor' ? (
              <>
                <TeamBox instructor={username} />
                <div className="mt-10">
                  <TeamBox />
                </div>
              </>
            ) : (
              <TeamBox student={username} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
