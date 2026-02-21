const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authcontroller.register);
router.post("/login", authcontroller.login);
router.post("/logout", authMiddleware, authcontroller.logout);
router.delete("/delete", authMiddleware, authcontroller.deletea);

router.get("/me", authMiddleware, authcontroller.me);
router.put("/update", authMiddleware, authcontroller.updateProfile);

module.exports = router;
