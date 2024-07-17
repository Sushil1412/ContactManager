import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import ContactList from './components/ContactList';
import RegistrationForm from './components/RegistrationForm';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
      fetchContacts();
    }
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:8001/contacts', {
        headers: { Authorization: token },
      });
      setContacts(res.data);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8001/login', { username, password });
      const { token, contacts } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setLoggedIn(true);
      setContacts(contacts);
      setSearchResults(contacts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setLoggedIn(false);
    setContacts([]);
    setSearchResults([]);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'searchTerm') {
      setSearchTerm(value);
      handleSearch(value);
    }
  };

  const handleSearch = searchTerm => {
    if (searchTerm.trim() === '') {
      setSearchResults(contacts);
    } else {
      const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredContacts);
    }
  };

  return (
    <Router>
      <div className="App">
        {loggedIn ? (
          <div className="contact-manager">
            <h1>Contact Manager</h1>
            <button onClick={handleLogout}>Logout</button>

            <Routes>
              <Route path="/" element={<ContactList contacts={searchResults} fetchContacts={fetchContacts} setContacts={setContacts} token={token} />} />
            </Routes>
          </div>
        ) : (
          <div>
            {showRegistration ? (
              <div className="registration-container">
                <RegistrationForm onRegister={() => setShowRegistration(false)} />
                <p className="text-center">
                  Already have an account?{' '}
                  <button className="btn btn-link" onClick={() => setShowRegistration(false)}>
                    Login here
                  </button>
                </p>
              </div>
            ) : (
              <div className="login-form">
                <h1>Login</h1>
                <input
                  className='in'
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleChange}
                  required
                />
                <input
                  className='in'
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <button onClick={handleLogin}>Login</button>
                <p className="text-center">
                  Don't have an account?{' '}
                  <button className="btn btn-link" onClick={() => setShowRegistration(true)}>
                    Register here
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
