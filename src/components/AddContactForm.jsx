import React, { useState } from 'react';
import axios from 'axios';
import './AddContactForm.css'; // Import CSS file for styling

function AddContact({ token, fetchContacts }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8001/contacts/add', formData, {
                headers: { Authorization: token },
            });
            fetchContacts(); // Fetch updated contact list
            setFormData({ name: '', email: '', phone: '' }); // Clear form data
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="form-container">
            <h2>Add Contact</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default AddContact;
