const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const {
      fullName: { firstName, lastName },
      email,
      password,
    } = req.body;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await user.create({
      fullName: { firstName, lastName },
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
}

function deletea(req, res) {
  user
    .findByIdAndDelete(req.user.id)
    .then(() => {
      res.clearCookie("token");
      res.json({ message: "Account deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error" });
    });
}

async function me(req, res) {
  try {
    const currentUser = await user.findById(req.user._id).select("-password");

    res.json(currentUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

/* UPDATE PROFILE */
async function updateProfile(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    if (password && password.trim().length >= 6) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
      updateData.provider = "local";
    }

    await user.findByIdAndUpdate(req.user._id, updateData);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
}

module.exports = {
  register,
  login,
  logout,
  deletea,
  me,
  updateProfile,
};
