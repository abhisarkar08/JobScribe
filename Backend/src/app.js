const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const User = require("./models/user.model");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");      // 🔥 ADD
const dashboardRoutes = require("./routes/dashboard.routes"); // 🔥 ADD

const app = express();

/* ============ MIDDLEWARES ============ */
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
}

/* ============ STATIC FRONTEND ============ */
app.use(express.static(path.join(__dirname, "../public")));

/* ============ GOOGLE AUTH ============ */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          existingUser = await User.create({
            email,
            fullName: {
              firstName:
                profile.name?.givenName ||
                profile.displayName ||
                "User",
              lastName: profile.name?.familyName || "",
            },
            googleId: profile.id,
            provider: "google",
          });
        }
        return done(null, existingUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* ============ AUTH ROUTES ============ */
app.use("/api/auth", authRoutes);

/* 🔥🔥 MISSING ROUTES — THIS WAS THE BUG 🔥🔥 */
app.use("/api/resume", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ============ REACT FALLBACK (KEEP *name) ============ */
app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;