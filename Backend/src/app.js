const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const user = require("./models/user.model");

const app = express();

/* 🔥 CORS MUST BE FIRST */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,               // 🔥 cookie allow
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* ---------- GOOGLE AUTH ---------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let existingUser = await user.findOne({ email });

        if (!existingUser) {
          existingUser = await user.create({
            email,
            fullName: {
              firstName:
                profile.name.givenName || profile.displayName || "user",
              lastName: profile.name.familyName || "",
            },
            googleId: profile.id,
            provider: "google",
          });
        }

        return done(null, existingUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/* ---------- ROUTES ---------- */
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect("http://localhost:5173/user");
  }
);

module.exports = app;