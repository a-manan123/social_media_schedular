import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PLATFORM_OPTIONS } from "../../utils/constants";
import Loader from "../common/Loader";

const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content cannot exceed 500 characters"),
  platforms: z
    .array(z.string())
    .min(1, "At least one platform must be selected"),
  scheduledAt: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      return selectedDate > new Date();
    },
    { message: "Scheduled time must be in the future" }
  ),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      { message: "Invalid URL" }
    ),
});

const PostForm = ({ onSubmit, initialData, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      content: "",
      platforms: [],
      scheduledAt: "",
      imageUrl: "",
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialData?.platforms || []
  );

  useEffect(() => {
    if (initialData) {
      setValue("content", initialData.content);
      setValue(
        "scheduledAt",
        initialData.scheduledAt
          ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
          : ""
      );
      setValue("imageUrl", initialData.imageUrl || "");
      setSelectedPlatforms(initialData.platforms || []);
    }
  }, [initialData, setValue]);

  const handlePlatformChange = (platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(newPlatforms);
    setValue("platforms", newPlatforms, { shouldValidate: true });
  };

  const contentLength = watch("content")?.length || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("content")}
          id="content"
          rows={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="What's on your mind? (max 500 characters)"
        />
        <div className="flex justify-between mt-1">
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
          <p
            className={`text-sm ml-auto ${
              contentLength > 450 ? "text-red-600" : "text-gray-500"
            }`}
          >
            {contentLength}/500
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <label
              key={platform.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform.value)}
                onChange={() => handlePlatformChange(platform.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{platform.label}</span>
            </label>
          ))}
        </div>
        {errors.platforms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.platforms.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="scheduledAt"
          className="block text-sm font-medium text-gray-700"
        >
          Schedule Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          {...register("scheduledAt")}
          type="datetime-local"
          id="scheduledAt"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.scheduledAt && (
          <p className="mt-1 text-sm text-red-600">
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL (Optional)
        </label>
        <input
          {...register("imageUrl")}
          type="url"
          id="imageUrl"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader size="sm" />
          ) : initialData ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
