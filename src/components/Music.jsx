import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Disc3, Music2 } from 'lucide-react'

const Music = () => {
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const songs = [
    {
      title: 'Chicken Fried',
      artist: 'Cover',
      file: '/Assets/Music/chicken fried.mp3',
      cover: '/Assets/Images/chickenfried.png',
    },
    {
      title: 'Hard to Handle',
      artist: 'Cover',
      file: '/Assets/Music/hard to handle.mp3',
      cover: '/Assets/Images/Hard to Handle.png',
    },
    {
      title: 'Harder to Breathe',
      artist: 'Cover',
      file: '/Assets/Music/harder to breathe.mp3',
      cover: '/Assets/Images/Harder to Breath.png',
    },
    {
      title: 'The Middle',
      artist: 'Cover',
      file: '/Assets/Music/the middle.mp3',
      cover: '/Assets/Images/the middle.png',
    },
    {
      title: 'The Ocean',
      artist: 'Cover',
      file: '/Assets/Music/the ocean.mp3',
      cover: '/Assets/Images/the ocean.png',
    },
  ]

  const handlePlayPause = (index) => {
    if (currentPlaying === index) {
      audioRef.current.pause()
      setCurrentPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = songs[index].file
        audioRef.current.play()
      }
      setCurrentPlaying(index)
    }
  }

  const handleAudioEnd = () => {
    setCurrentPlaying(null)
    setCurrentTime(0)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressClick = (e, index) => {
    if (currentPlaying !== index || !audioRef.current) return
    
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <section id="music" className="section-padding bg-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            Our Music
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-2xl mx-auto">
            Listen to our cover performances - hit play to hear us rock! 🎸
          </p>
        </motion.div>

        {/* Audio Player (hidden) */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnd}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => setCurrentPlaying(null)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.map((song, index) => (
            <motion.div
              key={song.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              {/* Album Cover */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60" />
                
                {/* Play/Pause Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={() => handlePlayPause(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary rounded-full p-4 cursor-pointer"
                  >
                    {currentPlaying === index ? (
                      <Pause size={32} fill="white" className="text-white" />
                    ) : (
                      <Play size={32} fill="white" className="text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Currently Playing Indicator */}
                {currentPlaying === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-primary rounded-full p-2"
                  >
                    <Music2 size={20} className="text-white animate-pulse" />
                  </motion.div>
                )}
              </div>

              {/* Song Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                  <Disc3 size={16} />
                  <span>{song.artist}</span>
                </div>
                <h3 className="text-2xl font-bold text-light mb-4">{song.title}</h3>
                
                {/* Progress Bar */}
                {currentPlaying === index && (
                  <div className="mb-4">
                    <div 
                      onClick={(e) => handleProgressClick(e, index)}
                      className="w-full h-2 bg-light/20 rounded-full cursor-pointer overflow-hidden group/progress"
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentTime / duration) * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-light/60 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
                
                {/* Play Button */}
                <button
                  onClick={() => handlePlayPause(index)}
                  className={`w-full ${
                    currentPlaying === index
                      ? 'bg-primary text-white'
                      : 'bg-primary/20 hover:bg-primary text-light'
                  } py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-300 flex items-center justify-center gap-2`}
                >
                  {currentPlaying === index ? (
                    <>
                      <Pause size={20} />
                      Now Playing
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Play Song
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Christmas Set Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-display font-bold text-center text-light mb-4">
            Christmas Set Performances
          </h3>
          <p className="text-center text-light/70 mb-12 max-w-2xl mx-auto">
            Enjoy our festive holiday performances 🎄✨
          </p>
          
          {/* Spotify Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl">
              <h4 className="text-2xl font-bold text-light mb-4 text-center">Stream O Holy Night on Spotify</h4>
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/track/5Ou2XRelp9Pht1cBoMqdSk?utm_source=generator"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/MB1-Wq1aIqo"
                  title="O Holy Night - Sick Day with Ferris"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h4 className="text-xl font-bold text-light">O Holy Night</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/jCXYYRcqkN8"
                  title="Christmas Performance - Sick Day with Ferris"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h4 className="text-xl font-bold text-light">Christmas Performance</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            >
              <div className="aspect-video bg-dark">
                <video
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src="/Assets/Video/LocalYocal_XmasParty_2025.MOV" type="video/quicktime" />
                  <source src="/Assets/Video/LocalYocal_XmasParty_2025.MOV" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4">
                <h4 className="text-xl font-bold text-light">Local Yocal Christmas Party 2025</h4>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Music
