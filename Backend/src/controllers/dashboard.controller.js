const dashboardService = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(
      req.user.id
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};
