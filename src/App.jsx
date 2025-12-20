import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Header />
      <Hero />
      <About />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
