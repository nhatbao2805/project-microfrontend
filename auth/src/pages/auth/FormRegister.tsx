import React, { ChangeEvent, FormEvent, useState } from "react";
import { registerUser } from "../../services/auth.service";
interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}
const FormRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) newErrors.email = "email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "email không hợp lệ";

    if (!formData.name) newErrors.name = "Tên không được để trống";

    if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await registerUser(formData);
        console.log("Đăng ký thành công:", formData);
      } catch (error) {
        console.log("Đăng ký thành công:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md"
        noValidate
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Đăng ký tài khoản
        </h2>

        {/* email */}
        <label
          htmlFor="email"
          className="block mb-2 text-gray-700 font-semibold"
        >
          email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nhập email của bạn"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        {/* Name */}
        <label
          htmlFor="name"
          className="block mt-6 mb-2 text-gray-700 font-semibold"
        >
          Tên
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nhập tên của bạn"
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}

        {/* Password */}
        <label
          htmlFor="password"
          className="block mt-6 mb-2 text-gray-700 font-semibold"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nhập mật khẩu"
          required
          minLength={6}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <label
          htmlFor="confirmPassword"
          className="block mt-6 mb-2 text-gray-700 font-semibold"
        >
          Xác nhận mật khẩu
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nhập lại mật khẩu"
          required
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default FormRegister;
