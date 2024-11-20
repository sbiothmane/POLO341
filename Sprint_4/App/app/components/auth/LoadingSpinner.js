'use client';

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  )
}
