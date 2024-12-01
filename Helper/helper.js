const jwt = require("jsonwebtoken");

const generateToken = (data, expiresIn) => {
  let token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: expiresIn || "30d",
  });
  return token;
};

const validateToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    return false;
  }
};

module.exports = { generateToken, validateToken };
