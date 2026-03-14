import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      {/* BANNER */}
      <div className="banner">
        <img src="/banner.png" className="banner-img" alt="Banner" />
        <h2>Register</h2>
      </div>

      {/* FORM */}
      <div className="form-container">
        <form className="form-box" onSubmit={handleSubmit}>
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
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
