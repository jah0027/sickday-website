import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, Star } from 'lucide-react'

const Venues = () => {
  // All events in one array - they'll be automatically sorted into upcoming/past
  const allEvents = [
    {
      date: '2025-12-23',
      displayDate: 'December 23, 2025',
      time: '7:00 PM - 9:00 PM',
      event: 'Light The World - Giving Machines',
      location: 'Historic Mainstreet Grapevine, 309 Main Street (corner of Main & Texas St)',
      description: 'Join us at the Christmas capital of Texas! The giving machines are a unique way of giving with all proceeds going to local & global charities. Machines open through Jan 1st!',
    },
    { date: '2024-05-10', displayDate: 'May 10, 2024', event: 'Corporate Event', location: 'Prosper, Texas' },
    { date: '2024-05-04', displayDate: 'May 04, 2024', event: 'Graduation Event', location: 'Melissa, Texas' },
    { date: '2024-04-20', displayDate: 'Apr 20, 2024', event: 'Private Party', location: 'Coppell, Texas' },
    { date: '2024-04-13', displayDate: 'Apr 13, 2024', event: 'Heart of Melissa Spring Fest', location: 'Melissa, Texas' },
    { date: '2024-04-06', displayDate: 'Apr 06, 2024', event: 'Mountain Fork Brewery', location: 'Broken Bow, OK' },
    { date: '2023-12-27', displayDate: 'Dec 27, 2023', event: 'Light The World Giving Machine Event', location: 'First National Bank Downtown McKinney Sq' },
    { date: '2023-12-16', displayDate: 'Dec 16, 2023', event: 'Light The World Giving Machine Event', location: 'Grapevine, Texas' },
    { date: '2023-12-10', displayDate: 'Dec 10, 2023', event: 'The Community Nativity', location: 'Carrollton, Texas' },
    { date: '2023-12-09', displayDate: 'Dec 09, 2023', event: 'Wolf Creek Farms Santa\'s Helpers 5K', location: 'Wolf Creek Farms' },
    { date: '2023-10-21', displayDate: 'Oct 21, 2023', event: 'McKinney City Interfaith Festival', location: 'Bonnie Wenk Park, McKinney, Texas' },
    { date: '2023-08-17', displayDate: 'Aug 17, 2023', event: 'Melissa High School Meet The Cardinals', location: 'Coach Kenny Deel Stadium' },
    { date: '2023-08-05', displayDate: 'Aug 05, 2023', event: 'Mountain Fork Brewery', location: 'Broken Bow, OK' },
    { date: '2023-04-22', displayDate: 'Apr 22, 2023', event: 'Private Event', location: 'Coppell, Texas' },
    { date: '2023-04-01', displayDate: 'Apr 01, 2023', event: 'Shuck Me Hochatown', location: 'Broken Bow, OK' },
    { date: '2023-01-06', displayDate: 'Jan 06, 2023', event: 'WealthWave Conference Corporate Event', location: 'Marriott Hotel, Allen, Texas' },
    { date: '2022-12-11', displayDate: 'Dec 11, 2022', event: 'Melissa Community Nativity Concert', location: 'Melissa, Texas' },
    { date: '2022-12-03', displayDate: 'Dec 03, 2022', event: 'Local Yocal Bar & Grill Corporate Event', location: 'McKinney, Texas' },
    { date: '2022-11-05', displayDate: 'Nov 05, 2022', event: 'McKinney Interfaith Festival', location: 'McKinney, Texas' },
  ]

  // Automatically separate upcoming and past events
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison

    const upcoming = allEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Soonest first

    const past = allEvents
      .filter(event => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first

    return { upcomingEvents: upcoming, pastEvents: past }
  }, [allEvents])

  return (
    <section id="venues" className="section-padding bg-gradient-to-b from-dark via-dark/95 to-dark">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            Where We've Played
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-3xl mx-auto leading-relaxed">
            From festivals to corporate events, weddings to community celebrations - 
            we bring the party to venues across the Dallas area and beyond!
          </p>
        </motion.div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-display font-bold text-center gradient-text mb-8">
              Upcoming Performances
            </h3>
            
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-10 rounded-3xl border-2 border-primary/40 mb-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-primary/30 rounded-2xl p-6 text-center">
                      <Calendar className="mx-auto mb-3 text-light" size={48} />
                      <div className="text-2xl font-bold text-light mb-2">{event.displayDate}</div>
                      {event.time && (
                        <div className="flex items-center justify-center gap-2 text-light/80">
                          <Clock size={18} />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h4 className="text-2xl md:text-3xl font-display font-bold text-light mb-3">
                      {event.event}
                    </h4>
                    <div className="flex items-start gap-2 text-light/90 mb-4">
                      <MapPin size={20} className="text-secondary mt-1 flex-shrink-0" />
                      <span className="text-lg">{event.location}</span>
                    </div>
                    {event.description && (
                      <>
                        <p className="text-light/80 leading-relaxed mb-4">
                          {event.description}
                        </p>
                        <div className="inline-block bg-secondary/20 px-4 py-2 rounded-lg text-secondary font-semibold">
                          🎄 See you there!
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Book Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-10 rounded-3xl text-center border border-primary/20">
            <Star className="mx-auto mb-4 text-secondary" size={48} />
            <h3 className="text-3xl font-display font-bold text-light mb-4">
              Book Us for Your Next Event!
            </h3>
            <p className="text-light/80 text-lg mb-6">
              Looking for live entertainment? We're available for weddings, corporate events, 
              festivals, private parties, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex items-center gap-2 text-light">
                <Clock size={20} className="text-primary" />
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-light">
                <MapPin size={20} className="text-secondary" />
                <span>Dallas area & beyond</span>
              </div>
            </div>
            <a
              href="#contact"
              className="btn-primary inline-block"
            >
              Contact Us to Book
            </a>
          </div>
        </motion.div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-display font-bold text-center gradient-text mb-12">
              Past Performances
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={`${event.date}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl hover:scale-105 transition-all duration-300 border border-primary/20 hover:border-primary/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors">
                      <Calendar size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-secondary font-semibold mb-2">
                        {event.displayDate}
                      </div>
                    <h4 className="text-lg font-bold text-light mb-2">
                      {event.event}
                    </h4>
                    <div className="flex items-start gap-2 text-light/70 text-sm">
                      <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}

        {/* Venue Types */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold text-light mb-8">
            We Play All Types of Events
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Festivals',
              'Corporate Events',
              'Weddings',
              'Private Parties',
              'Community Events',
              'Breweries',
              'Restaurants',
              'Bars',
              'Holiday Events',
              'Fundraisers',
            ].map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 rounded-full text-light font-semibold hover:from-primary/30 hover:to-secondary/30 transition-all duration-300"
              >
                {type}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Venues
