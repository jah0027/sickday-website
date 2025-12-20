import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Facebook } from 'lucide-react'

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-dark to-primary/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-2xl mx-auto">
            Want to book us for your next event? Reach out to our booking contact below!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <Mail className="text-primary" size={32} />
              <h3 className="text-2xl font-bold text-light">Email Us</h3>
            </div>
            <a
              href="mailto:hello@sickdaywithferris.com"
              className="text-lg text-light/70 hover:text-primary transition-colors"
            >
              hello@sickdaywithferris.com
            </a>
          </motion.div>

          {/* Booking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-secondary/10 to-primary/10 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <MessageCircle className="text-secondary" size={32} />
              <h3 className="text-2xl font-bold text-light">Booking Contact</h3>
            </div>
            <div className="space-y-2">
              <p className="text-light font-semibold">Kacie Baxley</p>
              <a
                href="tel:214-734-6891"
                className="block text-lg text-light/70 hover:text-secondary transition-colors"
              >
                214-734-6891
              </a>
              <a
                href="mailto:kacie@kaciebaxley.com"
                className="block text-lg text-light/70 hover:text-secondary transition-colors"
              >
                kacie@kaciebaxley.com
              </a>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-light mb-6">Follow Us</h3>
            <div className="space-y-4">
              <motion.a
                href="https://www.facebook.com/sickdaywithferris"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-center gap-4 text-light/70 hover:text-primary transition-colors"
              >
                <div className="bg-primary/20 p-2 rounded-full">
                  <Facebook size={24} />
                </div>
                <span className="text-lg">Sick Day with Ferris</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
