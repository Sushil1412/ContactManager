import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import CSS file for styling
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";

function NavBar({ handleLogout, handleSearch, darkMode, toggleDarkMode }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = e => {
        const { value } = e.target;
        setSearchTerm(value); // Update searchTerm state
        handleSearch(value); // Call handleSearch function passed from props
    };

    return (
        <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">Contact Manager</Link>
            </div>
            {/* <div className="navbar-center">
                <input
                    type="search"
                    className="search-input"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div> */}
            <div className="navbar-right">
                <button onClick={toggleDarkMode} className="mode-switch">
                    {darkMode ? <MdOutlineDarkMode className='l' /> : <MdDarkMode className='d' />}
                </button>
                <Link to="/add" className="nav-link">Add Contact</Link>
                <button onClick={handleLogout} className="nav-link">Logout</button>
            </div>
        </nav>
    );
}

export default NavBar;
