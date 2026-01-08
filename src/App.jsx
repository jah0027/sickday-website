import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Venues from './components/Venues'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import BookingChat from './components/BookingChat'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Panel Route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        
        {/* Main Website */}
        <Route path="/" element={
          <div className="min-h-screen bg-dark">
            <Header />
            <Hero />
            <About />
            <Venues />
            <Gallery />
            <Contact />
            <Footer />
            <BookingChat />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
