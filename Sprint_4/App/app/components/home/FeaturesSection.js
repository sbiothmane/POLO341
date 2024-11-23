'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AnimatedCard from './AnimatedCard'
import { features } from './data'
import { Users, CheckCircle, BarChart, Lock } from 'lucide-react'

const iconMap = {
  Users: Users,
  CheckCircle: CheckCircle,
  BarChart: BarChart,
  Lock: Lock,
}

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon]
            return (
              <AnimatedCard key={feature.id}>
                <Card className="bg-gray-900/50 border-none text-white h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IconComponent className="h-6 w-6" />
                      <span className="ml-2">{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
