import { useEffect, useState } from "react";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";
import PostList from "../components/posts/PostList";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await postsAPI.getPosts(params);
      if (response.success) {
        setPosts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await postsAPI.deletePost(postId);
      if (response.success) {
        toast.success(response.message || "Post deleted successfully");
        fetchPosts();
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Posts
          </h1>
          <Link
            to="/posts/create"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-center"
          >
            Create Post
          </Link>
        </div>

        <PostList
          posts={posts}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          onStatusFilter={handleStatusFilter}
          currentStatus={statusFilter}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Posts;
