import React from 'react'
import { motion } from 'framer-motion'
import { Music2, Heart, Facebook } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Music', href: '#music' },
        { label: 'Gallery', href: '#gallery' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Contact', href: '#contact' },
        { label: 'Book Us', href: '#contact' },
        { label: 'Facebook', href: 'https://www.facebook.com/sickdaywithferris' },
      ],
    },
  ]

  return (
    <footer className="bg-dark border-t border-primary/20">
      <div className="container-custom py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Music2 className="text-primary" size={32} />
              <span className="text-2xl font-display font-bold gradient-text">
                Sick Day with Ferris
              </span>
            </motion.div>
            <p className="text-light/70 mb-4 max-w-md">
              Taking the day off to make some noise. Join us on our musical journey 
              and never miss a beat!
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 mb-4">
              <motion.a
                href="https://www.facebook.com/sickdaywithferris"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="bg-primary/20 hover:bg-primary p-3 rounded-full transition-colors duration-300"
              >
                <Facebook size={24} className="text-light" />
              </motion.a>
            </div>
            
            <div className="flex items-center gap-2 text-light/60">
              <span>Made with</span>
              <Heart className="text-primary" size={16} fill="currentColor" />
              <span>by the band</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-light font-bold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-light/70 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8 text-center text-light/60">
          <p>© {currentYear} Sick Day with Ferris. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Life moves pretty fast. If you don't stop and listen once in a while, 
            you could miss it. 🎸
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
