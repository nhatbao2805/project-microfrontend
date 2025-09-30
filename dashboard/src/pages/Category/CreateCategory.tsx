import React from 'react';
import { useForm } from 'react-hook-form';

interface CategoryFormData {
  name: string;
  icon?: string;
  color?: string;
}

const iconOptions = [
  { label: '🍔', value: '🍔' },
  { label: '🎮 ', value: '🎮' },
  { label: '📚 ', value: '📚' },
  { label: '🏥', value: '🏥' },
  { label: '🚗 ', value: '🚗' },
  { label: '💼 ', value: '💼' },
  { label: '🎁 ', value: '🎁' },
  { label: '🏠 ', value: '🏠' },
  { label: '🛒 ', value: '🛒' },
  { label: '🧾 ', value: '🧾' },
];

const CreateCategory: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>();

  const onSubmit = (data: CategoryFormData) => {
    console.log('Dữ liệu danh mục gửi đi:', data);
    // Gửi API hoặc xử lý tiếp
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white p-6 rounded-md shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Tạo danh mục hóa đơn</h2>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="name">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Tên danh mục là bắt buộc' })}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Nhập tên danh mục"
        />
        {errors.name && (
          <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Icon */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="icon">
          Biểu tượng (Icon)
        </label>
        <select
          id="icon"
          {...register('icon')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          defaultValue=""
        >
          <option value="" disabled>
            Chọn biểu tượng
          </option>
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block mb-1 font-medium" htmlFor="color">
          Màu sắc
        </label>
        <input
          id="color"
          type="color"
          {...register('color')}
          className="w-12 h-10 p-1 border border-gray-300 rounded-md"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Lưu danh mục
      </button>
    </form>
  );
};

export default CreateCategory;
