const express = require("express");
const {
    handleGetallUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,
} = require("../controllers/user")



const router = express.Router();

// REST APIs
router.route('/').get(handleGetallUsers).post(handleCreateNewUser);

// Merging GET, PATCH, DELETE routes with app.route()
router
    .route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById);

module.exports = router