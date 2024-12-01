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
    const q = req.query.q;
    const filterArea = req.query.filterarea;

    let query = {
      $or: [
        { userId: { $regex: String(q), $options: "i" } },
        { username: { $regex: String(q), $options: "i" } },
      ],
    };

    if (filterArea) {
      query.area = filterArea;
    }

    let data = await UserModeld.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "userId username area active amountPaid balancedAmount"
      );
      

    res.status(200).json({ message: "User count successfully", data });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ error: "Failed to get user." });
  }
};

module.exports = Controller;