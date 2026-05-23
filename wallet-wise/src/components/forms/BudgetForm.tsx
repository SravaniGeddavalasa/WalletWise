import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { budgetSchema } from "../../validations/schemas";
import Input from "../common/Input";
import Button from "../common/Button";
import type { BudgetLimit } from "../../services/mockDb";

interface BudgetFormProps {
  initialData?: BudgetLimit | null;
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

export const BudgetForm: React.FC<BudgetFormProps> = ({
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
    resolver: yupResolver(budgetSchema),
    defaultValues: {
      category: "",
      limit: undefined as any,
      period: "monthly",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category,
        limit: initialData.limit,
        period: initialData.period,
      });
    } else {
      reset({
        category: "",
        limit: undefined as any,
        period: "monthly",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-foreground/95 select-none">
          Category
        </label>
        <select
          className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={!!initialData} // Category is immutable on edit
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

      <Input
        label="Monthly Limit (₹)"
        type="number"
        placeholder="0.00"
        error={errors.limit?.message?.toString()}
        {...register("limit")}
      />

      <Button type="submit" isLoading={isLoading} fullWidth className="mt-6">
        {initialData ? "Save Budget" : "Create Budget"}
      </Button>
    </form>
  );
};

export default BudgetForm;
