import User from "../models/user.model.js";
export const getAnalyticsData = async () => {

    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ])
    const { totalSales, totalRevenue } = salesData[0] || ({ totalSales: 0, totalRevenue: 0 });
    return {
        user: totalUsers,
        products: totalProducts,
        sales: totalSales,
        revenue: totalRevenue
    }

}
export const getDailySalesData = async (startDate, endDate) => {
    const dailySalesData = await Order.aggregate([
        {
            $match: { createdAt: { $gte: startDate, $lte: endDate } }
        },
        {
            $group: {
                _id: { $dateTOString: { format: "%Y-%m-%d", date: "$createdAt" } },
                sales: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    [
        {
            date: "2023-01-05",
            sales: 10,
            revenue: 100
        },
        {
            date: "2023-01-06",
            sales: 2,
            revenue: 300
        },
        {
            date: "2023-01-07",
            sales: 2,
            revenue: 100
        },
        {
            date: "2023-01-08",
            sales: 10,
            revenue: 100
        },
        {
            date: "2023-01-09",
            sales: 2,
            revenue: 400
        },
    ]
    const dateArray = getDatesInRange(startDate, endDate);
    return dateArray.map((date) => {
        const foundData=dailySalesData.find(();
    })

}

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}