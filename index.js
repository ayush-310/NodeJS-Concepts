const express = require("express");
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/youtube-app-1", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

// Define Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
}, { timestamps: true });

// Define Model
const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.json());  // Middleware to parse JSON data
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log('Hello from middleware 1');
    req.myUserName = 'piyushgarg.dev';
    next();
});

app.use((req, res, next) => {
    console.log('Hello from middleware 2:', req.myUserName);
    next();
});

// Routes
app.get('/users', async (req, res) => {
    const allDbUsers = await User.find({});
    const html = `
       <ul>
       ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join('')}
       </ul>
    `;
    res.send(html);
});

// REST APIs
app.get('/api/users', async (req, res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
});

app.post('/api/users', async (req, res) => {
    const body = req.body;

    if (
        !body ||
        !body.firstName ||
        !body.lastName ||
        !body.email ||
        !body.gender ||
        !body.jobTitle
    ) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    // Creates the user 
    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gender: body.gender,
        jobTitle: body.jobTitle,
    });

    console.log('result:', result);
    return res.status(201).json({ msg: "User created successfully" });
});

// Merging GET, PATCH, DELETE routes with app.route()
app.route("/api/users/:id")
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    })
    .patch(async (req, res) => {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ status: 'User updated successfully', updatedUser });
    })
    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        res.json({ status: 'User deleted successfully' });
    });

// Start the server
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
