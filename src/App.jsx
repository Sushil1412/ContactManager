import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import ContactList from './components/ContactList';
import AddContact from './components/AddContactForm';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginFom';
import EditContact from './components/EditContactForm';
import NavBar from './components/NavBar';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
      fetchContacts(storedToken);
    }
  }, []);

  const fetchContacts = async (token) => {
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

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setSearchResults(contacts);
    } else {
      const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredContacts);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'searchTerm') {
      handleSearch(value);
    }
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        {loggedIn && (
          <NavBar
            handleLogout={handleLogout}
            handleSearch={handleSearch}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        {!loggedIn ? (
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
              <div className="login-container">
                <LoginForm
                  username={username}
                  password={password}
                  handleChange={handleChange}
                  handleLogin={handleLogin}
                  setShowRegistration={setShowRegistration}
                />
              </div>
            )}
          </div>
        ) : (

          <Routes>
            {/* <Route path="/" element={<LoginForm username={username}
              password={password}
              handleChange={handleChange}
              handleLogin={handleLogin}
              setShowRegistration={setShowRegistration} />} /> */}
            <Route path="/" element={<ContactList contacts={searchResults} token={token} />} />
            <Route path="/add" element={<AddContact token={token} />} />
            <Route path="/edit/:contactId" element={<EditContact token={token} fetchContacts={fetchContacts} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
