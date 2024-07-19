import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EditContactForm.css';

function EditContact({ token }) {
    const { contactId } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchContact();

    }, [contactId]);

    const fetchContact = async () => {
        try {
            const res = await axios.get(`http://localhost:8001/contacts/${contactId}`, {
                headers: { Authorization: token },
            });
            const { name, email, phone } = res.data;
            console.log("hhhhhhhh");
            setFormData({ name, email, phone });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8001/contacts/edit/${contactId}`, formData, {
                headers: { Authorization: token },
            });
            // Handle success, redirect, or update UI as needed
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container">
            <h2>Edit Contact</h2>
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

export default EditContact;
