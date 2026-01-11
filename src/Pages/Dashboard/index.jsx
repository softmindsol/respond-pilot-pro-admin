import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  useGetDashboardStatsQuery,
  useGetRevenueAnalyticsQuery,
} from "@/store/api/adminApi";

import StatCard from "../../components/DashboardComponents/statCards";

// Mock data for development (replace with API data)
const mockStats = {
  totalUsers: 12453,
  totalRevenue: 89420,
  activeSubscriptions: 3247,
  growthRate: 12.5,
  userGrowth: 8.3,
  revenueGrowth: 15.2,
};

const mockRevenueData = [
  { month: "Jan", revenue: 4000, users: 240 },
  { month: "Feb", revenue: 3000, users: 198 },
  { month: "Mar", revenue: 5000, users: 280 },
  { month: "Apr", revenue: 4500, users: 308 },
  { month: "May", revenue: 6000, users: 389 },
  { month: "Jun", revenue: 5500, users: 430 },
  { month: "Jul", revenue: 7000, users: 520 },
];

const mockSubscriptionData = [
  { name: "Free", value: 278, color: "#6b7280" },
  { name: "Basic", value: 400, color: "#FEC36D" },
  { name: "Pro", value: 300, color: "#D78001" },
  { name: "Pro Plus", value: 200, color: "#FF5D02" },
  { name: "Top-Notch", value: 200, color: "#07ff3e66" },
];

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: revenueData, isLoading: revenueLoading } =
    useGetRevenueAnalyticsQuery({ period: "7months" });

  // Use API data or fallback to mock data
  const stats = statsData || mockStats;
  const chartData = revenueData?.data || mockRevenueData;
  const subscriptionData = mockSubscriptionData;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-light">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change={stats.userGrowth}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueGrowth}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={formatNumber(stats.activeSubscriptions)}
          change={stats.growthRate}
          icon={Activity}
          trend="up"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={TrendingUp}

        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-[#1a1818] border-[#2a2828]">
          <CardHeader>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Monthly revenue for the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FEC36D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FEC36D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2828" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1818",
                      border: "1px solid #2a2828",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FEC36D"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card className="bg-[#1a1818] border-[#2a2828]">
          <CardHeader>
            <CardTitle className="text-white">Subscription Plans</CardTitle>
            <CardDescription className="text-gray-400">
              Distribution by plan type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1818",
                      border: "1px solid #2a2828",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [formatNumber(value), "Users"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {subscriptionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card className="bg-[#1a1818] border-[#2a2828]">
        <CardHeader>
          <CardTitle className="text-white">User Growth</CardTitle>
          <CardDescription className="text-gray-400">
            New user registrations over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2828" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1818",
                    border: "1px solid #2a2828",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value) => [formatNumber(value), "Users"]}
                />
                <Bar dataKey="users" fill="#D78001" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
