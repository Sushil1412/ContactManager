import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditContactForm from './EditContactForm';

function ContactList({ token }) {
    const [contacts, setContacts] = useState([]);
    const [editingContactId, setEditingContactId] = useState(null);
    const [addingContact, setAddingContact] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        setSearchResults(
            contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, contacts]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('http://localhost:8001/contacts', {
                headers: { Authorization: token },
            });
            setContacts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = id => {
        setEditingContactId(id);
    };

    const handleCancelEdit = () => {
        setEditingContactId(null);
    };

    const handleAddContact = () => {
        setAddingContact(true);
    };

    const handleCancelAdd = () => {
        setAddingContact(false);
        setFormData({ name: '', email: '', phone: '' });
    };

    const handleUpdateContact = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:8001/contacts/edit/${id}`, updatedData, {
                headers: { Authorization: token },
            });
            fetchContacts();
            setEditingContactId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`http://localhost:8001/contacts/delete/${id}`, {
                headers: { Authorization: token },
            });
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8001/contacts/add', formData, {
                headers: { Authorization: token },
            });
            fetchContacts();
            setAddingContact(false);
            setFormData({ name: '', email: '', phone: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" onChange={handleSearchChange} placeholder="Search by Name" aria-label="Search" value={searchTerm} />

                    </form>
                </div>
            </nav>
            <button onClick={handleAddContact}>Add Contact</button>
            {addingContact && (

                <form onSubmit={handleAddSubmit} >
                    <div className='ad'>
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
                        <button type="submit">Add Contact</button>
                        <button type="button" onClick={handleCancelAdd}>Cancel</button>
                    </div>
                </form>

            )}
            {/* <input className='inpu'
                type="text"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={handleSearchChange}
            /> */}

            <ul>
                {searchResults.map(contact => (
                    <li key={contact._id} className='item d-flex justify-content-between align-items-center'>
                        <span>{contact.name}, </span>
                        <span>{contact.email}, </span>
                        <span>{contact.phone}</span>
                        <button className='btn btn-primary ml-2 ed' onClick={() => handleEdit(contact._id)}>Edit</button>
                        <button className='btn btn-primary ml-2 ed' onClick={() => handleDelete(contact._id)}>Delete</button>
                        {editingContactId === contact._id && (
                            <EditContactForm
                                contact={contact}
                                token={token}
                                onUpdate={(id, updatedData) => handleUpdateContact(id, updatedData)}
                                onCancelEdit={handleCancelEdit}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContactList;
