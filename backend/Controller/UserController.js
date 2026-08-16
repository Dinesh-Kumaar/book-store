const UserModel = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email,password, role } = req.body; // destructuring the request body to get user details

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10); // hashing the password with a salt round of 10
        } catch (hashErr) {
            return res
                .status(500)
                .json({ success: false, message: "Password hashing failed" });
        }

        const newuser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign({ id: newuser._id, role: newuser.role }, "secret_key", {
            expiresIn: "8h",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            newuser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await UserModel.findOne({ email });
        console.log("User: ", user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, "secret_key", { expiresIn: "8h" });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.name = name || user.name; 
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        console.log("User: ", deletedUser);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("Deleting user with ID: ", req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};

// get user by id
const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password"); // params = parameter in the URL
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user by ID",
        });
    }
};
module.exports = { registerUser, loginUser, updateUser, deleteUser, getUserById };