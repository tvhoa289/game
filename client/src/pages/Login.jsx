import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      alert('Registration successful! Please login.');
      setIsRegister(false);
      setFormData({ username: '', email: '', phone: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        {/* Title Frame */}
        <div className="title-frame">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
        </div>

        {/* Form Container */}
        <div className="form-container">
          {!isRegister ? (
            <form id="loginForm" className="form-box" onSubmit={handleLogin}>
              <input 
                name="username" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Enter'}
              </button>
              <p className="switch">
                Don't have an account?
                <a onClick={() => setIsRegister(true)}>Register now</a>
              </p>
            </form>
          ) : (
            <form id="registerForm" className="form-box" onSubmit={handleRegister}>
              <input 
                name="username" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <input 
                name="phone" 
                placeholder="Phone" 
                value={formData.phone}
                onChange={handleChange}
              />
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
              <p className="switch">
                Already have an account?
                <a onClick={() => setIsRegister(false)}>Login</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
