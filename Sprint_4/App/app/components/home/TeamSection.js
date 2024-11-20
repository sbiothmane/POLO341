'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AnimatedCard from './AnimatedCard'
import { teamMembers } from './data'

export default function TeamSection() {
  return (
    <section className="py-20 bg-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <AnimatedCard key={index}>
              <Card className="bg-gray-900/50 border-none text-white h-full">
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>ID: {member.id}</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
