'use client'

import { motion } from 'framer-motion'

export default function AuthFormWrapper({ children, title }) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        {title}
      </h2>
      {children}
    </motion.div>
  )
}
