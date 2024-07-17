import React, { useState } from 'react';
import axios from 'axios';

function AddContactForm({ token, fetchContacts }) {
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
            fetchContacts();
            setFormData({ name: '', email: '', phone: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="add-contact-form">
            <h2>Add Contact</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
}

export default AddContactForm;
