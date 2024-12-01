const UserModeld = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (find.role !== "admin") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const data = await UserModeld.find({
      active: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "userId username createdAt package totalAmount amountPaid balancedAmount lastMonthDue active"
      );

    const totalDocuments = await UserModeld.countDocuments();

    res.status(200).json({
      message: "User data fetched successfully.",
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(totalDocuments / limit),
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data." });
  }
};

module.exports = Controller;
