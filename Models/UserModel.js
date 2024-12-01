const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    connectionType: { type: String, required: true },
    port: { type: String },
    vlan: { type: String },
    package: { type: String, required: true },
    packageRate: { type: String, required: true },
    amountPaid: { type: String, required: true },
    cnicNumber: { type: String, required: true },
    phoneNumber: { type: String },
    cellNumber: { type: String },
    address: { type: String, required: true },
    area: { type: String },
    staticIP: { type: Boolean, default: false },
    staticIPAmmount: { type: String, default: "" },
    staticIPAddress: { type: String, default: "" },
    remark: { type: String, default: "" },
    lastMonthDue: { type: String, default: "" },
    active: { type: Boolean, default: true },
    totalAmount: { type: Number, default: 0 },
    balancedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Schema.pre("save", function (next) {
  const staticIPAmmount = parseFloat(this.staticIPAmmount) || 0;
  const lastMonthDue = parseFloat(this.lastMonthDue) || 0;
  const packageRate = parseFloat(this.packageRate) || 0;
  const amountPaid = parseFloat(this.amountPaid) || 0;

  const total = staticIPAmmount + lastMonthDue + packageRate;
  const balanced = total - amountPaid;
  this.totalAmount = total;
  this.balancedAmount = balanced;
  console.log("====================================");
  console.log(
    "Pre Save User :  Total ===",
    total,
    " ,   Balanced ===== ",
    balanced
  );
  console.log("====================================");

  next();
});
Schema.pre("findOneAndUpdate", function (next) {
  const updatedData = this.getUpdate();
  const staticIPAmmount = parseFloat(updatedData.$set.staticIPAmmount || 0);
  const lastMonthDue = parseFloat(updatedData.$set.lastMonthDue || 0);
  const packageRate = parseFloat(updatedData.$set.packageRate || 0);
  const amountPaid = parseFloat(updatedData.$set.amountPaid || 0);

  const total = staticIPAmmount + lastMonthDue + packageRate;
  const balanced = total - amountPaid;
  updatedData.$set.totalAmount = total;
  updatedData.$set.balancedAmount = balanced;

  console.log("====================================");
  console.log(
    "Pre Update User :  Total ===",
    total,
    " ,   Balanced ===== ",
    balanced
  );

  console.log("====================================");

  next();
});

module.exports = mongoose.model("User", Schema);
