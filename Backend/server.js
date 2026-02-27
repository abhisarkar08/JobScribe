require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const resumeRoutes = require("./src/routes/resume.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");

connectDB();

app.use("/api/resume", resumeRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});