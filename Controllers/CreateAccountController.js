const AdminModel = require("../Models/AdminModel");
const bcrypt = require("bcryptjs");

const Controller = async (req, res) => {
  let { username, password, profile, role } = req.body;

  if (!username || !password || !profile) {
    return res
      .status(400)
      .json({ error: "Username, password and profile picture are required." });
  }

  let user = await AdminModel.findOne({ username: username });

  if (user) {
    return res.status(409).json({ error: "Username already exists." });
  }

  // Hash the password before saving it to the database.
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);

  let newUser = new AdminModel({
    name: username,
    password: hashedPassword,
    profilePicture: profile,
    role,
  });

  await newUser.save();

  return res.status(201).json({ message: "User created successfully." });
};

module.exports = Controller;
