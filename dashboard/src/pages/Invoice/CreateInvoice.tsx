import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../../components/CustomSelect";
import { createInvoiceWithImage } from "../../services/ai.service";
import {
  createInvoice,
  CreateInvoiceDto,
  getInvoiceById,
  updateInvoice,
} from "../../services/invoice.service";

interface InvoiceFormData {
  title: string;
  amount: string;
  category?: string;
  note?: string;
  invoiceDate: string;
  dueDate?: string;
  isPaid: boolean;
}

const categories = ["Electricity", "Water", "Office Supplies", "Other"];

const CreateInvoice: React.FC = () => {
  const id = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      isPaid: false,
      invoiceDate: new Date().toISOString().split("T")[0],
    },
  });
  const [aiText, setAiText] = useState<string>("");
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    setValue("amount", formatted);
  };

  const formatCurrency = (value: string) => {
    const numberValue = value.replace(/[^\d]/g, "");
    if (!numberValue) return "";
    return Number(numberValue).toLocaleString("en-US");
  };
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const fetchDetailInvoice = async () => {
    try {
      const response = await getInvoiceById(id.invoiceId ?? "");

      const normalized = {
        ...response,
        invoiceDate: formatDate(response.invoiceDate),
        dueDate: formatDate(response.dueDate),
      };

      Object.entries(normalized).forEach(([key, value]) => {
        setValue(key as keyof InvoiceFormData, value as any);
      });
    } catch (error) {
      console.error("Error fetching detail invoice:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailInvoice();
    }
  }, [id?.invoiceId]);
  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Chuyển đổi dữ liệu form sang format API
      const invoiceData: CreateInvoiceDto = {
        title: data.title,
        amount: Number(data.amount.replace(/,/g, "")), // Chuyển đổi từ string có dấu phẩy sang number
        category: data.category,
        note: data.note,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        isPaid: data.isPaid,
      };

      const response = (await id?.invoiceId)
        ? updateInvoice(id.invoiceId ?? "", invoiceData)
        : createInvoice(invoiceData);
      console.log("Invoice created successfully:", response);

      // Hiển thị thông báo thành công
      setSubmitSuccess(true);

      // Điều hướng sang danh sách hoá đơn sau khi tạo thành công
      setTimeout(() => {
        navigate("/invoice/list");
      }, 800);
    } catch (error) {
      console.error("Error creating invoice:", error);
      // Có thể thêm toast notification hoặc error message ở đây
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      // Reuse API by sending pasted text instead of image
      const formData = new FormData();
      formData.append("text", aiText);
      const response = await createInvoiceWithImage(formData);
    } catch (error) {
      console.error("Error generating invoice with AI:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-8 ring-1 ring-gray-100 h-full">
      {isSubmitting && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-white/70 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="font-medium">Creating invoice...</span>
          </div>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
        {id?.invoiceId ? "Edit Invoice" : "Create Invoice"}
      </h2>

      {/* Mode Switch */}
      {id?.invoiceId ? (
        <div className="flex w-full bg-gray-50 rounded-2xl p-1.5 relative ring-1 ring-gray-100">
          {["manual", "ai"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "manual" | "ai")}
              className={`relative flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300 ${
                mode === m ? "text-white" : "text-gray-600 hover:bg-white"
              }`}
            >
              {mode === m && (
                <motion.div
                  layoutId="highlight"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                {m === "manual" ? (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
                  </svg>
                )}
                {m === "manual" ? "Manual" : "AI Generate"}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}

      {/* Animated content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {mode === "manual" ? (
            <motion.form
              key="manual-form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 min-h-[500px]"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Invoice Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  placeholder="Enter invoice title"
                  className={`block w-full rounded-xl border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ring-1 ring-inset ${
                    errors.title
                      ? "border-red-500 ring-red-200 focus:ring-red-500"
                      : "border-gray-200 ring-gray-100 focus:ring-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Amount + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                      $
                    </span>
                    <input
                      {...register("amount", {
                        required: "Amount is required",
                        validate: (value) => {
                          const numeric = Number(value.replace(/,/g, ""));
                          if (isNaN(numeric) || numeric <= 0)
                            return "Amount must be greater than 0";
                          return true;
                        },
                      })}
                      type="text"
                      inputMode="numeric"
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className={`block w-full rounded-xl border pl-8 pr-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ring-1 ring-inset ${
                        errors.amount
                          ? "border-red-500 ring-red-200 focus:ring-red-500"
                          : "border-gray-200 ring-gray-100 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <CustomSelect
                    label="Category"
                    options={categories}
                    value={watch("category")}
                    onChange={(val) => setValue("category", val)}
                    placeholder="Select category"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("invoiceDate", {
                      required: "Invoice date required",
                    })}
                    type="date"
                    className={`block w-full rounded-xl border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ring-1 ring-inset ${
                      errors.invoiceDate
                        ? "border-red-500 ring-red-200 focus:ring-red-500"
                        : "border-gray-200 ring-gray-100 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {/* Due Date (optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="block w-full rounded-xl border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ring-1 ring-inset border-gray-200 ring-gray-100 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  {...register("note")}
                  rows={3}
                  placeholder="Optional note..."
                  className="block w-full rounded-xl border border-gray-200 ring-1 ring-inset ring-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Is Paid */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Paid</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isPaid"
                    {...register("isPaid")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-semibold shadow-md transform transition ${
                  submitSuccess
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Invoice...
                  </div>
                ) : submitSuccess ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Invoice Created Successfully!
                  </div>
                ) : id?.invoiceId ? (
                  "Update Invoice"
                ) : (
                  "Create Invoice"
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="ai-form"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 min-h-[500px] flex flex-col"
            >
              {isGenerating ? (
                // Skeleton UI
                <div className="space-y-4 animate-pulse flex-1">
                  <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-12 w-full bg-gray-200 rounded"></div>
                  <div className="h-20 w-full bg-gray-200 rounded"></div>
                  <div className="h-12 w-1/3 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-200">
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold text-indigo-600">
                        AI-powered
                      </span>{" "}
                      invoices — paste your invoice text below and we’ll extract
                      details instantly.
                    </p>
                  </div>

                  {/* Paste Text only */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Paste Invoice Text
                    </label>
                    <textarea
                      rows={6}
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      placeholder="Paste invoice text here..."
                      className="block w-full rounded-xl border border-gray-200 ring-1 ring-inset ring-gray-100 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <p>No file upload needed.</p>
                      <p>{aiText.trim().length} chars</p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !aiText.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transform transition disabled:opacity-50"
                  >
                    Generate with AI
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateInvoice;
