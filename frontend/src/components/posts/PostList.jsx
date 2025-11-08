import { useState } from "react";
import PostCard from "./PostCard";
import PostTable from "./PostTable";
import { STATUS_OPTIONS } from "../../utils/constants";
import Loader from "../common/Loader";

const PostList = ({
  posts,
  pagination,
  loading,
  onPageChange,
  onStatusFilter,
  currentStatus,
  onDelete,
}) => {
  const [statusFilter, setStatusFilter] = useState(currentStatus || "");
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    onStatusFilter(newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter and View Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">View:</span>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Posts Display */}
      {viewMode === "table" ? (
        <PostTable posts={posts} onDelete={onDelete || (() => {})} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={onDelete || (() => {})}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8">
          {/* Pagination Info */}
          <div className="text-center mb-4 text-sm text-gray-600">
            Showing page {pagination.page} of {pagination.pages} (
            {pagination.total} total posts)
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 1 &&
                      pageNum <= pagination.page + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${
                        pageNum === pagination.page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Show pagination info even when only one page */}
      {pagination && pagination.pages === 1 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing all {pagination.total} post{pagination.total !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default PostList;
