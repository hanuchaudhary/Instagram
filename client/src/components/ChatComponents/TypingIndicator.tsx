import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 w-fit bg-primary rounded-full px-2 py-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-secondary rounded-full"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export default TypingIndicator

