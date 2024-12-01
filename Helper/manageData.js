const PaymentModel = require("../Models/PaymentModel");
const UserModel = require("../Models/UserModel");
const UserStatmentModel = require("../Models/UserStatmentModel");

module.exports.addUser = async (data) => {
  const user = new UserModel(data);
  await user.save();

  let totalAmmount = Number(user.packageRate);

  if (user.staticIP) {
    totalAmmount += Number(user.staticIPAmmount);
  }

  const statementHistory = new UserStatmentModel({
    userID: user._id.toString(),
    statementHistory: [
      {
        type: "AmmountPaid",
        lastAmountPaid: 0,
        newAmountPaid: parseInt(user.amountPaid || 0),
        totalAmountPaidChange : parseInt(user.amountPaid || 0),
        date: new Date(),
      },
    ],
    package: user.package,
    totalAmmount: totalAmmount,
    active: true,
  });

  await statementHistory.save();

  let totalAmount = parseFloat(user.packageRate || 0);
  if (user.staticIP) {
    totalAmount += parseFloat(user.staticIPAmmount || 0);
  }

  let amountPaid = parseFloat(user.amountPaid || 0);
  let totalSale = amountPaid;
  let advanceBalanced = 0;
  let balanced = 0;

  if (totalAmount < amountPaid) {
    advanceBalanced = amountPaid - totalAmount;
  } else {
    balanced = totalAmount - amountPaid;
  }

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

  return {
    user,
    paymentReport,
  }
};
