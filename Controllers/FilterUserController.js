const UserModel = require("../Models/UserModel");

const Controller = async (req, res) => {
  const { 
    startDate, 
    endDate, 
    area, 
    lastMonthDue, 
    minAmount, 
    maxAmount, 
    page = 1, 
    limit = 20 
  } = req.query;

  try {
    let filterConditions = {};

    if (startDate || endDate) {
      let dateFilter = {};

      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }

      if (endDate) {
        dateFilter.$lte = new Date(endDate); 
      }

      filterConditions.createdAt = dateFilter;
    }

    if (area) {
      const areasArray = area.split(',').map((areaItem) => areaItem.trim());
      filterConditions.area = { $in: areasArray };
    }

    if (lastMonthDue) {
      filterConditions.lastMonthDue = lastMonthDue === 'receive' ? { $gt: 0 } : { $lt: 0 };
    }

    if (minAmount || maxAmount) {
      let amountFilter = {};
      if (minAmount) amountFilter.$gte = parseFloat(minAmount);
      if (maxAmount) amountFilter.$lte = parseFloat(maxAmount);
      
      filterConditions.balancedAmount = amountFilter;
    }

    const skip = (page - 1) * limit;

    const users = await UserModel.find(filterConditions)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalDocuments = await UserModel.countDocuments(filterConditions);

    res.status(200).json({
      message: "Filtered users fetched successfully.",
      currentPage: parseFloat(page),
      limit: limit,
      totalPages: Math.ceil(totalDocuments / limit),
      totalUsers: totalDocuments,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch filtered users." });
  }
};

module.exports = Controller;
