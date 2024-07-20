import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 8001;
const JWT_SECRET = 'sushil'; // Replace with a long, random string for production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contactManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema
const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: String,
    email: String,
    phone: String,
});

const Contact = mongoose.model('Contact', ContactSchema);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Fetch user's contacts
        const contacts = await Contact.find({ user: user._id });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, contacts });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Middleware to authenticate requests
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Protected routes
app.get('/contacts', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.userId });
        res.json(contacts);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/contacts/add', authMiddleware, async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const newContact = new Contact({ user: req.userId, name, email, phone });
        await newContact.save();
        res.status(201).send('Contact added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/contacts/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await Contact.findOneAndDelete({ _id: id, user: req.userId });
        res.status(200).send('Contact deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/contacts/edit/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
        await Contact.findOneAndUpdate({ _id: id, user: req.userId }, { name, email, phone });
        res.status(200).send('Contact updated successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});




// Example using Axios
app.post('/contacts/search', authMiddleware, async (req, res) => {
    console.log('Bad Request: Missing or empty name parameter');
    const { name } = req.query;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        console.log('Bad Request: Missing or empty name parameter');
        return res.status(400).send('Bad Request: Missing or empty name parameter');
    }

    console.log(`Received search request with name: ${name}`);

    try {
        const contacts = await Contact.find({
            user: req.userId,
            name: { $regex: name, $options: 'i' } // Case-insensitive search
        });

        if (contacts.length > 0) {
            console.log(`Found ${contacts.length} contacts`);
        } else {
            console.log('No contacts found');
        }

        res.json(contacts);
    } catch (err) {
        console.error('Error searching contacts:', err);
        res.status(500).send(err);
    }
});

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/contactapp/dist"));
}




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
