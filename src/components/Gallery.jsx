import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    {
      url: '/Assets/Images/image_50438913.JPG',
      caption: 'Live Performance',
    },
    {
      url: '/Assets/Images/_DSC6128.jpg',
      caption: 'The Band',
    },
    {
      url: '/Assets/Images/_DSC6130.jpg',
      caption: 'On Stage',
    },
    {
      url: '/Assets/Images/_DSC6131.jpg',
      caption: 'Rocking Out',
    },
    {
      url: '/Assets/Images/_DSC6138.jpg',
      caption: 'Live Show',
    },
    {
      url: '/Assets/Images/_DSC6142.jpg',
      caption: 'In Action',
    },
    {
      url: '/Assets/Images/_DSC6143.jpg',
      caption: 'Performance',
    },
    {
      url: '/Assets/Images/_DSC6145.jpg',
      caption: 'On Stage',
    },
    {
      url: '/Assets/Images/thumbnail_IMG_7592.jpg',
      caption: 'Band Photo',
    },
    {
      url: '/Assets/Images/PXL_20221204_015649890.MP.jpg',
      caption: 'Live Concert',
    },
    {
      url: '/Assets/Images/thunderpigs6.jpg',
      caption: 'Group Shot',
    },
    {
      url: '/Assets/Images/image_6487327.JPG',
      caption: 'Performance Night',
    },
  ]

  return (
    <section id="gallery" className="section-padding bg-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-6">
            Gallery
          </h2>
          <p className="text-lg md:text-xl text-light/70 max-w-2xl mx-auto">
            Moments captured from our journey 📸
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-light font-semibold">{image.caption}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ZoomIn className="text-light" size={48} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-md p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-light hover:text-primary transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X size={32} />
              </button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-w-6xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="w-full h-auto rounded-xl"
                />
                <p className="text-light text-center text-xl mt-4 font-semibold">
                  {selectedImage.caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Gallery
