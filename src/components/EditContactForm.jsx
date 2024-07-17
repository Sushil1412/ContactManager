import React, { useState } from 'react';
import axios from 'axios';

function EditContactForm({ contact, token, onUpdate, onCancelEdit }) {
    const [formData, setFormData] = useState({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
    });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8001/contacts/edit/${contact._id}`, formData, {
                headers: { Authorization: token },
            });
            onUpdate(contact._id, formData); // Call onUpdate function passed from parent
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
            <button type="submit">Update Contact</button>
            <button type="button" onClick={onCancelEdit}>Cancel</button>
        </form>
    );
}

export default EditContactForm;
