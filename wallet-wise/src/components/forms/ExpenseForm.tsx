import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "../../validations/schemas";
import Input from "../common/Input";
import Button from "../common/Button";
import { Upload, X } from "lucide-react";
import type { Transaction } from "../../services/mockDb";

interface ExpenseFormProps {
  initialData?: Transaction | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Healthcare",
  "Other",
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: undefined as any,
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        description: initialData.description || "",
      });
      if (initialData.receiptUrl) {
        setReceiptPreview(initialData.receiptUrl);
      } else {
        setReceiptPreview(null);
      }
    } else {
      reset({
        title: "",
        amount: undefined as any,
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setReceiptFile(null);
      setReceiptPreview(null);
    }
  }, [initialData, reset]);

  // Handle Receipt Upload Trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setValue("receipt", file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setValue("receipt", undefined);
  };

  const handleFormSubmit = (data: any) => {
    // Attach receipt file if uploaded
    if (receiptFile) {
      data.receipt = receiptFile;
    } else if (receiptPreview) {
      // Keep existing receiptUrl if editing
      data.receiptUrl = receiptPreview;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Grocery shopping"
        error={errors.title?.message?.toString()}
        {...register("title")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message?.toString()}
          {...register("amount")}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-semibold text-foreground/95 select-none">
            Category
          </label>
          <select
            className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("category")}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && (
            <span className="text-xs font-medium text-destructive">{errors.category.message}</span>
          )}
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        error={errors.date?.message?.toString()}
        {...register("date")}
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-foreground/95 select-none">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Additional details..."
          className="flex w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("description")}
        />
        {errors.description && (
          <span className="text-xs font-medium text-destructive">{errors.description.message}</span>
        )}
      </div>

      {/* Receipt Image Upload */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-foreground/95 select-none">
          Receipt Attachment
        </label>
        {receiptPreview ? (
          <div className="relative border rounded-xl overflow-hidden aspect-video bg-muted/20 flex items-center justify-center max-h-48 group">
            <img src={receiptPreview} alt="Receipt Preview" className="h-full object-contain" />
            <button
              type="button"
              onClick={removeReceipt}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary/50 bg-background/30 rounded-xl cursor-pointer transition-all hover:bg-muted/10 group select-none">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                  Click to upload receipt
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, or PDF up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>

      <Button type="submit" isLoading={isLoading} fullWidth className="mt-6">
        {initialData ? "Save Changes" : "Add Expense"}
      </Button>
    </form>
  );
};

export default ExpenseForm;
