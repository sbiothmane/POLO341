'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, Users, Clock, PieChart } from 'lucide-react'

// Role-Based Links Configuration
const roleLinks = [
  {
    href: '/create_time',
    label: 'Office Hours',
    icon: Clock,
    gradient: 'from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600',
  },
  {
    href: '/create_poll',
    label: 'Polls',
    icon: PieChart,
    gradient: 'from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600',
  },
  {
    href: '/create_teams',
    label: 'Team',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
  },
]

export default function Navbar() {
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          PeerAssess
        </Link>

        <div className="flex items-center space-x-4">
          {/* Role-Based Buttons */}
          {role === 'instructor' && (
            <div className="flex space-x-2">
              {roleLinks.map(({ href, label, icon: Icon, gradient }) => (
                <NavButton key={href} href={href} label={label} Icon={Icon} gradient={gradient} />
              ))}
            </div>
          )}

          {/* Auth Buttons */}
          <AuthButton session={session} />
        </div>
      </div>
    </nav>
  )
}

// Reusable Navigation Button Component
const NavButton = ({ href, label, Icon, gradient }) => (
  <Link href={href}>
    <Button
      variant="outline"
      className={`flex items-center bg-gradient-to-r ${gradient} text-white`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  </Link>
)

// Reusable Authentication Buttons
const AuthButton = ({ session }) => {
  if (session) {
    return (
      <Button
        variant="ghost"
        className="text-gray-800 flex items-center hover:bg-gray-100"
        onClick={() => signOut()}
      >
        <User className="mr-2 h-5 w-5" />
        Logout
      </Button>
    )
  }

  return (
    <>
      <Button variant="ghost" asChild className="text-gray-800 hover:bg-gray-100">
        <Link href="/login">Login</Link>
      </Button>
      <Button
        asChild
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-full"
      >
        <Link href="/signup">Sign Up</Link>
      </Button>
    </>
  )
}
