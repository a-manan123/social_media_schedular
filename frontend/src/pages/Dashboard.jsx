import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { toast } from "react-toastify";
import StatsCard from "../components/dashboard/StatsCard";
import UpcomingPosts from "../components/dashboard/UpcomingPosts";
import Loader from "../components/common/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, upcomingResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getUpcoming(5),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (upcomingResponse.success) {
        setUpcomingPosts(upcomingResponse.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Posts"
            value={stats?.totalPosts || 0}
            icon={<span className="text-white text-xl">📝</span>}
            color="blue"
          />
          <StatsCard
            title="Scheduled"
            value={stats?.scheduledPosts || 0}
            icon={<span className="text-white text-xl">⏰</span>}
            color="yellow"
          />
          <StatsCard
            title="Published"
            value={stats?.publishedPosts || 0}
            icon={<span className="text-white text-xl">✅</span>}
            color="green"
          />
          <StatsCard
            title="Draft"
            value={stats?.draftPosts || 0}
            icon={<span className="text-white text-xl">📄</span>}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts by Platform */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Posts by Platform</h3>
            {stats?.platforms && stats.platforms.length > 0 ? (
              <div className="space-y-4">
                {stats.platforms.map((item) => (
                  <div
                    key={item.platform}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700 font-medium">
                      {item.platform}
                    </span>
                    <div className="flex items-center flex-1 mx-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 mr-2">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{
                            width: `${(item.count / stats.totalPosts) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-900 font-bold">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No posts yet</p>
            )}
          </div>

          {/* Upcoming Posts */}
          <div className="lg:col-span-1">
            <UpcomingPosts posts={upcomingPosts} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
