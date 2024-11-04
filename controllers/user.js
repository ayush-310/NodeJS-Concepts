const User = require('../models/user')

async function handleGetallUsers(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}


async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
}

async function handleUpdateUserById(req, res) {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'User updated successfully', updatedUser });
}

async function handleDeleteUserById(req, res) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: 'User deleted successfully' });
}


async function handleCreateNewUserById(req, res) {
    const body = req.body;
    console.log('Request body:', body);  // Log the incoming request body

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
    return res.status(201).json({ msg: "User created successfully", id: result._id });
}


module.exports = {
    handleGetallUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,
}