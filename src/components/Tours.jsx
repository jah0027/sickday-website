import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket } from 'lucide-react'

const Tours = () => {
  const tourDates = [
    {
      date: 'Jan 15, 2026',
      venue: 'The Garage',
      city: 'Chicago, IL',
      ticketUrl: '#',
      status: 'On Sale',
    },
    {
      date: 'Jan 22, 2026',
      venue: 'Rock House',
      city: 'Detroit, MI',
      ticketUrl: '#',
      status: 'On Sale',
    },
    {
      date: 'Feb 5, 2026',
      venue: 'The Underground',
      city: 'Seattle, WA',
      ticketUrl: '#',
      status: 'On Sale',
    },
    {
      date: 'Feb 12, 2026',
      venue: 'Electric Ballroom',
      city: 'Portland, OR',
      ticketUrl: '#',
      status: 'Almost Sold Out',
    },
    {
      date: 'Feb 20, 2026',
      venue: 'The Roxy',
      city: 'Los Angeles, CA',
      ticketUrl: '#',
      status: 'On Sale',
    },
    {
      date: 'Feb 28, 2026',
      venue: 'Brooklyn Steel',
      city: 'Brooklyn, NY',
      ticketUrl: '#',
      status: 'On Sale',
    },
  ]

  return (
    <section id="tours" className="section-padding bg-gradient-to-b from-dark to-primary/5">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            Tour Dates
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-2xl mx-auto">
            Come see us live! Nothing beats the energy of a live show 🔥
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {tourDates.map((show, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300 border border-primary/20"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <Calendar className="text-primary" size={24} />
                  <span className="text-light font-semibold text-lg">{show.date}</span>
                </div>

                {/* Venue & City */}
                <div className="flex-1 flex items-start md:items-center gap-3">
                  <MapPin className="text-secondary flex-shrink-0 mt-1 md:mt-0" size={24} />
                  <div>
                    <div className="text-light font-bold text-lg">{show.venue}</div>
                    <div className="text-light/70">{show.city}</div>
                  </div>
                </div>

                {/* Status & Tickets */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      show.status === 'Almost Sold Out'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                    }`}
                  >
                    {show.status}
                  </span>
                  <a
                    href={show.ticketUrl}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Ticket size={18} />
                    Tickets
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-light mb-4">Never Miss a Show</h3>
          <p className="text-light/70 mb-6">
            Sign up for our newsletter to get tour announcements and exclusive content
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-3 rounded-full bg-dark/50 border border-primary/30 text-light placeholder-light/40 focus:outline-none focus:border-primary"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Tours
