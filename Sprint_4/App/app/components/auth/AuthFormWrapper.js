'use client'

import { motion } from 'framer-motion'

const animationSettings = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function FormWrapper({ children, title }) {
  return (
    <motion.div
      className="form-container"
      {...animationSettings}
    >
      {title && (
        <h2 className="form-title">
          {title}
        </h2>
      )}
      {children}
    </motion.div>
  )
}
