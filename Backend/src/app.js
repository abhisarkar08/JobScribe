const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("./models/user.model");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

/* =====================================================
   🔥 MIDDLEWARES
===================================================== */

// JSON & cookies
app.use(express.json());
app.use(cookieParser());

// Passport
app.use(passport.initialize());

/* =====================================================
   🔥 CORS (ONLY FOR DEV)
   👉 Production me frontend same origin hota hai
===================================================== */
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    }),
  );
}

/* =====================================================
   🔥 STATIC FRONTEND (BUILD FILES)
===================================================== */
app.use(express.static(path.join(__dirname, "../public")));

/* =====================================================
   🔥 GOOGLE AUTH STRATEGY
===================================================== */
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
                profile.name?.givenName || profile.displayName || "User",
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
    },
  ),
);

/* =====================================================
   🔥 AUTH ROUTES
===================================================== */

app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 🔥 DEV vs PROD redirect
    if (process.env.NODE_ENV === "production") {
      res.redirect("/user");
    } else {
      res.redirect(`${process.env.CLIENT_URL}/user`);
    }
  },
);

/* =====================================================
  API ROUTES (example)
===================================================== */
// app.use("/api/user", require("./routes/user.routes"));

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);
/* =====================================================
   REACT ROUTER FALLBACK
===================================================== */

app.use("/api", (req, res) => {
  console.log("❌ API NOT FOUND:", req.originalUrl);
  return res.status(404).json({ message: "API route not found" });
});

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
