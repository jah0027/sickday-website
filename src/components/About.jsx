import React from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Star, Music, Mic, Guitar, Drum, Keyboard } from 'lucide-react'
import MusicSection from './Music'

const About = () => {
  const stats = [
    { icon: Users, label: 'Band Members', value: '6' },
    { icon: Heart, label: 'Shows Played', value: '100+' },
    { icon: Star, label: 'Years Rocking', value: '5+' },
  ]

  const bandMembers = [
    {
      name: 'Spencer Vehar',
      role: 'Lead Vocals',
      icon: Mic,
      bio: 'Spencer has been with Sick Day With Ferris from the very beginning. As Lead Singer, he takes on quite a lot of responsibility, from fine-tuning the musical arrangements to assisting other bandmates with perfecting their performances.',
      image: '/Assets/Images/_DSC6128.jpg',
    },
    {
      name: 'Kenny Favero',
      role: 'Lead Guitar',
      icon: Guitar,
      bio: 'A band wouldn\'t be complete without its Lead Guitarist, and Sick Day With Ferris couldn\'t have asked for a better one than the talented Kenny Favero. He plays an instrumental role in the success and musical progression of the band.',
      image: '/Assets/Images/_DSC6131.jpg',
    },
    {
      name: 'John Hall',
      role: 'Guitar',
      icon: Guitar,
      bio: 'John Hall, playing Rhythm and lead, has been with the band since the early days. He brings a vibe and tenor in his playing that rounds out the bands sound giving listeners a true delight.',
      image: '/Assets/Images/_DSC6143.jpg',
    },
    {
      name: 'Chris Jackman',
      role: 'Bass',
      icon: Music,
      bio: 'It\'s said the soul of the band can be found with it\'s bass arrangements, as the bass provides a connection between the drumbeat and the melody. Chris Jackman on Bass helps listeners identify the beat and get lost in the music.',
      image: '/Assets/Images/chris2.jpg',
    },
    {
      name: 'Matt Hayman',
      role: 'Drums',
      icon: Drum,
      bio: 'The Sick Day With Ferris drummer, Matt Hayman, lays the foundations, provides the pulse and brings the groove for the band. His playing lets the rest of the band express themselves creatively.',
      image: '/Assets/Images/_DSC6145.jpg',
    },
    {
      name: 'Dave Koford',
      role: 'Keyboards',
      icon: Keyboard,
      bio: 'Whether its laying down chord beds or blazing through an epic solo, Dave Koford\'s keyboard playing brings unique heart and soul to the music of Sick Day With Ferris!',
      image: '/Assets/Images/Dave1.jpg',
    },
  ]

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-dark to-dark/95">
      <div className="container-custom">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
            >
              <stat.icon className="mx-auto mb-4 text-primary" size={48} />
              <div className="text-4xl font-bold text-light mb-2">{stat.value}</div>
              <div className="text-light/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 md:p-12 rounded-3xl"
        >
          <h3 className="text-3xl font-display font-bold text-light mb-6">What We Do</h3>
          <p className="text-light/80 leading-relaxed mb-4">
            Past bookings include festivals, corporate events, weddings, restaurants, and bars. 
            We play danceable music with songs for audience participation that have made our 
            show popular with crowds of all ages.
          </p>
          <p className="text-light/80 leading-relaxed">
            Our repertoire spans decades of hits - from the electric 80's, the iconic 90's, 
            the memorable 00's, plus crowd-favorite country songs. With our extensive musical 
            experience and high-energy performances, we bring the party wherever we play! 🎉
          </p>
        </motion.div>

        {/* About the Band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            About the Band
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-3xl mx-auto leading-relaxed">
            Sick Day with Ferris is a local band in the Dallas area playing a mix of covers 
            from the 80's, 90's, and 00's as well as a collection of popular country songs. 
            We are a six piece group made up of members with many years of collective musical 
            experience. 🎸
          </p>
        </motion.div>
      </div>

      {/* Music Section */}
      <MusicSection />

      <div className="container-custom">
        {/* Band Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold text-center gradient-text mb-12">
            Meet the Band
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bandMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {/* Member Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-dark">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80" />
                  
                  {/* Role Badge */}
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full p-3">
                    <member.icon size={24} className="text-white" />
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-light mb-2">{member.name}</h4>
                  <p className="text-secondary font-semibold mb-4">{member.role}</p>
                  <p className="text-light/70 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
