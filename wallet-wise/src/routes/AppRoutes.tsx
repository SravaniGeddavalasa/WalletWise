import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded Public Pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// Lazy-loaded Authenticated Pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Expenses = lazy(() => import("../pages/expenses/Expenses"));
const Income = lazy(() => import("../pages/income/Income"));
const Budget = lazy(() => import("../pages/budget/Budget"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const Settings = lazy(() => import("../pages/settings/Settings"));

// Lazy-loaded Feature Pages
const ExpenseTracking = lazy(() => import("../pages/features/ExpenseTracking"));
const IncomeManagement = lazy(() => import("../pages/features/IncomeManagement"));
const BudgetPlanning = lazy(() => import("../pages/features/BudgetPlanning"));
const ReportGeneration = lazy(() => import("../pages/features/ReportGeneration"));

// Simple loading fallback
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Authenticated Dashboard Pages */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/income" element={<Income />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Feature Aliases */}
          <Route path="/expense-tracking" element={<ExpenseTracking />} />
          <Route path="/income-management" element={<IncomeManagement />} />
          <Route path="/budget-planning" element={<BudgetPlanning />} />
          <Route path="/report-generation" element={<ReportGeneration />} />
        </Route>

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
