import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "../../validations/schemas";
import Input from "../common/Input";
import Button from "../common/Button";
import type { Transaction } from "../../services/mockDb";

interface IncomeFormProps {
  initialData?: Transaction | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Gifts",
  "Refunds",
  "Other",
];

export const IncomeForm: React.FC<IncomeFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
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

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        description: initialData.description || "",
      });
    } else {
      reset({
        title: "",
        amount: undefined as any,
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Monthly Salary"
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

      <Button type="submit" isLoading={isLoading} fullWidth className="mt-6">
        {initialData ? "Save Changes" : "Add Income"}
      </Button>
    </form>
  );
};

export default IncomeForm;
