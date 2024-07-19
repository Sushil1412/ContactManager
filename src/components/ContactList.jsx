import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io'; // Import search icon from react-icons
import './ContactList.css';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function ContactList({ token }) {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults(contacts); // Show all contacts if searchTerm is empty
        } else {
            const filteredContacts = contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filteredContacts); // Update searchResults with filtered contacts
        }
    }, [searchTerm, contacts]);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('http://localhost:8001/contacts', {
                headers: { Authorization: token },
            });
            setContacts(res.data);
            setSearchResults(res.data); // Initialize searchResults with fetched contacts
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`http://localhost:8001/contacts/delete/${id}`, {
                headers: { Authorization: token },
            });
            fetchContacts(); // Fetch contacts again after deletion
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value); // Update searchTerm state with input value
    };

    return (
        <div className="contacts-container">
            <div className="search-container">
                <input
                    type="search"
                    className="search-input"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <IoMdSearch className="search-icon" />
            </div>
            <ul className="contacts-list">
                {searchResults.map(contact => (
                    <li key={contact._id} className="contact-item">
                        <span className='col-2'>{contact.name}, </span>
                        <span className='col-3'>{contact.email}, </span>
                        <span className='col-2'>{contact.phone}</span>
                        <Link to={`/edit/${contact._id}`} className="edit-button col-1"><FaEdit /></Link>
                        <a className="delete-button col-1" onClick={() => handleDelete(contact._id)}><MdDeleteOutline /></a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ContactList;
