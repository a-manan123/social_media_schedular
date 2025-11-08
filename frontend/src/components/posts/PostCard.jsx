import { Link } from "react-router-dom";
import { STATUS_COLORS, PLATFORM_COLORS } from "../../utils/constants";

const PostCard = ({ post, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEdit = post.status !== "published";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`${
                STATUS_COLORS[post.status] || "bg-gray-500"
              } text-white text-xs px-2 py-1 rounded`}
            >
              {post.status}
            </span>
            <span className="text-sm text-gray-500">
              Scheduled: {formatDate(post.scheduledAt)}
            </span>
          </div>
          <p className="text-gray-900 mb-3 line-clamp-3">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-48 object-cover rounded-md mb-3"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="flex flex-wrap gap-2 mb-4">
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
      </div>
      <div className="flex justify-end space-x-2">
        {canEdit && (
          <Link
            to={`/posts/${post._id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Edit
          </Link>
        )}
        <button
          onClick={() => onDelete(post._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostCard;
