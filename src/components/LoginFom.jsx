import React from 'react';
import './LoginForm.css';

function LoginForm({ username, password, handleChange, handleLogin, setShowRegistration }) {
  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
        className="input-field"
        required
      />
      <button onClick={handleLogin} className="login-button">Login</button>
      <p className="text-center">
        Don't have an account?{' '}
        <button className="register-link" onClick={() => setShowRegistration(true)}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
