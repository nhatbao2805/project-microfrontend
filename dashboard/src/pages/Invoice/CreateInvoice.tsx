import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import CustomSelect from "../../components/CustomSelect";

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
  const [fileName, setFileName] = useState<string>("");
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const onSubmit = (data: InvoiceFormData) => {
    console.log("Invoice data:", data);
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log("AI generated invoice!");
    }, 2500); // giả lập API 2.5s
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100 h-full">
      <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Create Invoice
      </h2>

      {/* Mode Switch */}
      <div className="flex w-full bg-gray-100 rounded-xl p-1 relative">
        {["manual", "ai"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as "manual" | "ai")}
            className={`relative flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
              mode === m ? "text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {mode === m && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">
              {m === "manual" ? "Manual" : "AI Generate"}
            </span>
          </button>
        ))}
      </div>

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
              className="space-y-6 min-h-[500px]" // giữ chiều cao cố định
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
                  className={`block w-full rounded-lg border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
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
                  placeholder="Enter amount"
                  className={`block w-full rounded-lg border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ${
                    errors.amount
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <CustomSelect
                label="Category"
                options={categories}
                value={watch("category")}
                onChange={(val) => setValue("category", val)}
                placeholder="Select category"
              />

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  {...register("note")}
                  rows={3}
                  placeholder="Optional note..."
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

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
                  className={`block w-full rounded-lg border px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 transition ${
                    errors.invoiceDate
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>

              {/* Is Paid */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPaid"
                  {...register("isPaid")}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="isPaid"
                  className="text-sm text-gray-700 font-medium"
                >
                  Paid
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform transition"
              >
                Save Invoice
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="ai-form"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 min-h-[500px] flex flex-col"
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
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-indigo-600">
                      AI-powered
                    </span>{" "}
                    invoices — just{" "}
                    <span className="font-medium text-blue-600">
                      upload a file
                    </span>{" "}
                    or
                    <span className="font-medium text-blue-600">
                      {" "}
                      paste text
                    </span>
                    , and we’ll
                    <span className="font-semibold text-indigo-600">
                      {" "}
                      extract details instantly
                    </span>
                    .
                  </p>
                  {/* Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload File
                    </label>

                    <div className="flex items-center justify-between w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-gray-600 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer relative">
                      <Upload className="w-6 h-6 text-blue-500" />
                      <div className="flex-1 text-center">
                        {fileName ? (
                          <span className="text-sm font-medium text-gray-800">
                            {fileName}
                          </span>
                        ) : (
                          <span className="text-sm">
                            <span className="text-blue-600 font-medium">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) =>
                          setFileName(e.target.files?.[0]?.name || "")
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Accepted formats: PDF, JPG, PNG. Max 10MB.
                    </p>
                  </div>

                  {/* Paste Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Paste Invoice Text
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Paste invoice text here..."
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform transition disabled:opacity-50"
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
