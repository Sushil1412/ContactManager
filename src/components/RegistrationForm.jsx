import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

function RegistrationForm({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8001/register', { username, password });
            onRegister();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="registration-form-container">
            <h2>Register</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                required
            />
            <button onClick={handleRegister} className="register-button">Register</button>
        </div>
    );
}

export default RegistrationForm;
