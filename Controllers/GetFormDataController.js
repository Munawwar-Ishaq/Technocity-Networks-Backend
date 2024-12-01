const AdminModel = require("../Models/AdminModel");
const FormModel = require("../Models/FormModel");

const Controller = async (req, res) => {
  let userID = req.headers["userID"];

  let find = await AdminModel.findById(userID);

  if (!find) {
    return res.status(401).json({ error: "Invalid admin." });
  }

  if (find.role !== "admin") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action." });
  }

  FormModel.find({}).then((formData) => {
    return res
      .status(200)
      .json({ message: "All Form data get successfully", data: formData });
  });
};

module.exports = Controller;
