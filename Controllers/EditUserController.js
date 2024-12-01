const AdminModel = require("../Models/AdminModel");
const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

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

  let { data, editedStatement } = req.body;

  if (!data.connectionType) {
    let foundUserData = await UserModel.findOne({ userId: data.userId }).select(
      "staticIPAmmount lastMonthDue packageRate"
    );
    console.log("Found Data", foundUserData);

    data = {
      amountPaid: data.amountPaid,
      staticIPAmmount: foundUserData.staticIPAmmount,
      lastMonthDue: foundUserData.lastMonthDue,
      packageRate: foundUserData.packageRate,
    };
  }

  let statements = editedStatement.statements;

  let balanced = editedStatement.balancedAmount;
  let totalSale = editedStatement.totalSaleAmount;
  let advanceBalanced = editedStatement.advanceBalancedAmount;

  if (!data || !statements || !Array.isArray(statements)) {
    return res.status(400).json({ error: "Invalid data or statements." });
  }

  let userdataid = req.body.data.userId;

  let findUserDataWithUserID = await UserModel.findOne({ userId: userdataid });

  if (!findUserDataWithUserID) {
    return res.status(404).json({ error: "User not found." });
  }

  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
  const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); 
  
  let statementHistory = await UserStatmentModel.findOne({
    userID: findUserDataWithUserID._id.toString(),
    createdAt: {
      $gte: startOfMonth, 
      $lt: startOfNextMonth, 
    },
  });

  if (!statementHistory) {
    let totalAmmount =
      Number(findUserDataWithUserID.packageRate) +
      Number(findUserDataWithUserID.lastMonthDue);

    if (findUserDataWithUserID.staticIP) {
      totalAmmount += Number(findUserDataWithUserID.staticIPAmmount);
    }

    statementHistory = new UserStatmentModel({
      userID: findUserDataWithUserID._id.toString(),
      statementHistory: [],
      active: findUserDataWithUserID.active,
      totalAmmount: totalAmmount,
    });
  }

  if (statements.length > 0) {
    statementHistory.statementHistory =
      statementHistory.statementHistory.concat(statements);
    statements.map((obj) => {
      if (obj.type === "userStatus") {
        statementHistory.active = obj.newStatus;
      } else {
        statementHistory.totalAmmount = obj.newTotalAmmount;
      }
    });
  }

  try {
    let userData = await UserModel.findOneAndUpdate(
      { _id: findUserDataWithUserID._id.toString() },
      { $set: { ...data } },
      { new: true, runValidators: true }
    );

    await statementHistory.save();

    let paymentReport = await PaymentModel.findOneAndUpdate(
      { type: "PaymentReport" },
      {
        $inc: {
          totalBalanced: balanced,
          totaSale: totalSale,
          advanceBalanced: advanceBalanced,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: "User Updated successfully.",
      data: userData,
      paymentReport,
    });
  } catch (err) {
    console.log("Error updating user data : ", err);
    return res.status(500).json({ error: "Failed to update user data." });
  }
};

module.exports = Controller;
