import { PLATFORM_COLORS } from "../../utils/constants";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UpcomingPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
        <p className="text-gray-500 text-center py-4">
          No upcoming posts scheduled
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-600 mb-1">
              {formatDate(post.scheduledAt)}
            </p>
            <p className="text-gray-900 font-medium mb-2 line-clamp-2">
              {post.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.platforms?.map((platform) => (
                <span
                  key={platform}
                  className={`${
                    PLATFORM_COLORS[platform] || "bg-gray-500"
                  } text-white text-xs px-2 py-1 rounded`}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPosts;
