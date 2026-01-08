import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setResetSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">
            Sick Day with Ferris
          </h1>
          <p className="text-light/70">Band Management Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-light mb-6">
            {resetMode ? 'Reset Password' : 'Sign In'}
          </h2>

          {error && (
            <div className="bg-primary/20 border border-primary/40 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-primary flex-shrink-0" size={20} />
              <p className="text-light text-sm">{error}</p>
            </div>
          )}

          {resetSent ? (
            <div className="bg-secondary/20 border border-secondary/40 rounded-xl p-6 text-center">
              <Mail className="mx-auto mb-4 text-secondary" size={48} />
              <p className="text-light mb-4">
                Check your email for a password reset link!
              </p>
              <button
                onClick={() => {
                  setResetMode(false)
                  setResetSent(false)
                }}
                className="text-secondary hover:text-secondary/80 font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-4">
              <div>
                <label className="block text-light/70 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light/50" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-dark/50 border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-light placeholder-light/50 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {!resetMode && (
                <div>
                  <label className="block text-light/70 text-sm mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light/50" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-dark/50 border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-light placeholder-light/50 focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  'Processing...'
                ) : resetMode ? (
                  'Send Reset Link'
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(!resetMode)
                    setError('')
                  }}
                  className="text-secondary hover:text-secondary/80 text-sm font-semibold"
                >
                  {resetMode ? 'Back to Sign In' : 'Forgot Password?'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a href="/" className="text-light/50 hover:text-light transition-colors text-sm">
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
