import * as yup from "yup";

// Authentication Schemas
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .integer("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be valid")
    .required("Age is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Please select a gender")
    .required("Gender is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

// Transaction Form Schema (Common for Add/Edit Expense & Income)
export const transactionSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
  category: yup
    .string()
    .required("Category is required"),
  date: yup
    .string()
    .required("Date is required"),
  description: yup
    .string()
    .max(200, "Description is too long")
    .optional(),
  receipt: yup
    .mixed()
    .optional(),
});

// Budget Schema
export const budgetSchema = yup.object().shape({
  category: yup
    .string()
    .required("Category is required"),
  limit: yup
    .number()
    .typeError("Limit must be a number")
    .required("Budget limit is required")
    .positive("Budget limit must be greater than zero"),
  period: yup
    .string()
    .default("monthly")
    .required("Period is required"),
});

// Profile Update Schema
export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full name is required")
    .min(3, "Name must be at least 3 characters"),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s-]{10,15}$/, {
      message: "Please enter a valid phone number",
      excludeEmptyString: true,
    })
    .optional(),
  address: yup
    .string()
    .max(100, "Address is too long")
    .optional(),
});

// Change Password Schema
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
