import { useState } from 'react'
import '@css/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <div className="login-page">
      <h1 className="login-title">Login</h1>
      
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="forgot-password">
            <a href="#" className="forgot-password-link">forgot password?</a>
          </div>
          
          <button type="submit" className="btn login-button">
            Login
          </button>
        </form>
      </div>
      
      <p className="signup-text">Don't have an account? Sign Up</p>
    </div>
  )
}

export default Login

