import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";
import PostForm from "../components/posts/PostForm";
import Loader from "../components/common/Loader";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPostById(id);
      if (response.success) {
        setPost(response.data);
      } else {
        toast.error("Post not found");
        navigate("/posts");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load post");
      navigate("/posts");
    } finally {
      setLoading(false);
    }
  };

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
      const response = await postsAPI.updatePost(id, payload);
      if (response.success) {
        toast.success(response.message || "Post updated successfully!");
        navigate("/posts");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <PostForm
            onSubmit={handleSubmit}
            initialData={{
              ...post,
              scheduledAt: post.scheduledAt
                ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                : "",
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
