import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, LogIn, UserPlus } from 'lucide-react'

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', data.user.id)
          .single()

        // Store user info
        sessionStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'user',
          username: profile?.username || email.split('@')[0]
        }))

        setSuccess('Login successful!')
        setTimeout(() => {
          onAuthSuccess({
            user: data.user,
            role: profile?.role || 'user',
            username: profile?.username || email.split('@')[0]
          })
        }, 1000)
      } else {
        // Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0]
            }
          }
        })

        if (error) throw error

        // Create profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: username || email.split('@')[0],
                email: email,
                role: 'user' // Default role
              }
            ])

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }
        }

        setSuccess('Account created! Please check your email to verify.')
        setTimeout(() => {
          setIsLogin(true)
          setSuccess('')
        }, 3000)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="card max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            {isLogin ? (
              <LogIn className="w-8 h-8 text-accent" />
            ) : (
              <UserPlus className="w-8 h-8 text-accent" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-text-muted">
            {isLogin
              ? 'Login to access your study materials'
              : 'Sign up to start organizing your learning'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
              setSuccess('')
            }}
            className={`flex-1 py-3 font-medium transition-all duration-300 ${
              isLogin
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-accent'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
              setSuccess('')
            }}
            className={`flex-1 py-3 font-medium transition-all duration-300 ${
              !isLogin
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-accent'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="input-field pl-10"
                  autoComplete="username"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field pl-10 pr-10"
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-text-muted mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              isLogin ? 'Logging in...' : 'Creating account...'
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Admin Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>🔐 Admin Access:</strong>
            <br />
            Only admin accounts can access the Data tab.
            <br />
            Contact your administrator for admin privileges.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
