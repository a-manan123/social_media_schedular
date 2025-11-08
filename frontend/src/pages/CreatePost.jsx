import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";
import PostForm from "../components/posts/PostForm";

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        content: data.content,
        platforms: data.platforms,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      };
      if (data.imageUrl && data.imageUrl.trim() !== "") {
        payload.imageUrl = data.imageUrl.trim();
      }
      const response = await postsAPI.createPost(payload);
      if (response.success) {
        toast.success(response.message || "Post created successfully!");
        navigate("/posts");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Post
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
