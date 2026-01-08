import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Disc3, Music2 } from 'lucide-react'

const Music = () => {
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const sharedCover = '/Assets/Images/ferris.png'; // Use the header image for all songs
  const songs = [
    {
      title: 'The Ocean',
      artist: 'Cover',
      file: '/Assets/Music/the ocean.mp3',
      cover: sharedCover,
    },
    {
      title: 'The Middle',
      artist: 'Cover',
      file: '/Assets/Music/the middle.mp3',
      cover: sharedCover,
    },
    {
      title: 'Hard to Handle',
      artist: 'Cover',
      file: '/Assets/Music/hard to handle.mp3',
      cover: sharedCover,
    },
    {
      title: 'Chicken Fried',
      artist: 'Cover',
      file: '/Assets/Music/chicken fried.mp3',
      cover: sharedCover,
    },
    {
      title: 'Harder to Breathe',
      artist: 'Cover',
      file: '/Assets/Music/harder to breathe.mp3',
      cover: sharedCover,
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
              className="group flex flex-row items-stretch bg-secondary/80 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 min-h-[220px]"
                className="group flex flex-row items-stretch bg-gradient-to-br from-dark via-dark/70 to-primary/20 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 min-h-[220px] shadow-xl border border-light/10 backdrop-blur-sm"
            >
              {/* Song Info (Left) - wider */}
              <div className="flex flex-col justify-center flex-[2_2_0%] p-8 min-w-0">
                <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
                  <Disc3 size={16} />
                  <span>{song.artist}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 whitespace-normal break-words">{song.title}</h3>
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
              {/* Image (Right) - narrower */}
              <div className="flex items-center justify-end flex-[1_1_0%] max-w-[180px] min-w-[100px] bg-dark/80">
                <img
                  src={sharedCover}
                  alt="Band Logo"
                  className="object-contain h-full w-full max-h-56 max-w-full p-4"
                />
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
