'use client'

import { useSession } from 'next-auth/react'
import { Loader2, User, BadgeCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (session) {
    const { id, name, role } = session.user

    return (
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/80 backdrop-blur-lg border-none mb-10">
              <CardHeader>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                  Welcome, {name}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>
                      <User className="inline mr-1 h-5 w-5 text-blue-500" /> ID: {id}
                    </span>
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span className="capitalize">{role}</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return null
}
