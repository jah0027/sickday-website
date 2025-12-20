import React from 'react'
import { motion } from 'framer-motion'
import { Music2, Zap } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Hero Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/80 to-primary/30" />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 md:opacity-40 pointer-events-none"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src="https://static.wixstatic.com/media/01ea67_42cd84070c164874b3028af07626efe2~mv2.png/v1/fill/w_334,h_928,al_c,lg_1,q_85,enc_avif,quality_auto/01ea67_42cd84070c164874b3028af07626efe2~mv2.png"
            alt="Band Logo"
            className="h-full w-auto object-contain ml-auto"
          />
        </motion.div>
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music2 className="text-primary" size={80} />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6">
            <span className="gradient-text">Sick Day</span>
            <br />
            <span className="text-light">with Ferris</span>
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-light/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Taking the day off to make some noise 🎸
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a href="#music" className="btn-primary inline-flex items-center gap-2">
              <Zap size={20} />
              Listen Now
            </a>
            <a href="#contact" className="btn-secondary">
              Book Us
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 ml-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
