import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Palette,
  Save,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const predefinedColors = [
  { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
  { name: "Green", value: "#10B981", bg: "bg-green-500" },
  { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
  { name: "Orange", value: "#F59E0B", bg: "bg-orange-500" },
  { name: "Red", value: "#EF4444", bg: "bg-red-500" },
  { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
  { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
  { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
];

const iconOptions = [
  { label: "Office", value: "📁", emoji: "📁" },
  { label: "Business", value: "💼", emoji: "💼" },
  { label: "Finance", value: "💰", emoji: "💰" },
  { label: "Marketing", value: "📢", emoji: "📢" },
  { label: "Travel", value: "✈️", emoji: "✈️" },
  { label: "Food", value: "🍕", emoji: "🍕" },
  { label: "Health", value: "🏥", emoji: "🏥" },
  { label: "Education", value: "📚", emoji: "📚" },
  { label: "Entertainment", value: "🎬", emoji: "🎬" },
  { label: "Shopping", value: "🛍️", emoji: "🛍️" },
];

const CreateCategory: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "📁",
    },
  });

  const watchedColor = watch("color");
  const watchedIcon = watch("icon");

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log("Category created:", data);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setValue("name", "");
        setValue("description", "");
        setValue("color", "#3B82F6");
        setValue("icon", "📁");
      }, 2000);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Create New Category
              </h1>
              <p className="text-gray-600 mt-1">
                Organize your invoices with custom categories
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Category Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Category Preview
              </h3>
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: watchedColor }}
                >
                  <span className="text-2xl">{watchedIcon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {watch("name") || "Category Name"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {watch("description") || "Category description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Category name is required" })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 cursor-blue ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter category name"
              />
              {errors.name && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-blue resize-none"
                placeholder="Describe what this category is for"
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Icon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("icon", option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      watchedIcon === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs text-gray-600">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Color
              </label>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setValue("color", color.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      watchedColor === color.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`h-8 w-8 rounded-lg mx-auto mb-2 ${color.bg}`}
                      />
                      <div className="text-xs text-gray-600">{color.name}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Custom Color Picker */}
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  {...register("color")}
                  className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  Or choose a custom color
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold shadow-md transform transition-all duration-200 flex items-center justify-center space-x-2 ${
                  submitSuccess
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Category...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Category Created Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateCategory;
