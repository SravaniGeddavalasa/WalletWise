import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { resetPasswordSchema } from "../../validations/schemas";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Wallet, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: any) => {
    if (!email || !otp) {
      addToast("Invalid password reset link. Missing email or OTP.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(email, otp, data.password);
      addToast("Password changed successfully! Please log in with your new password.", "success");
      navigate("/login");
    } catch (error: any) {
      addToast(error.message || "Failed to reset password. Link might be invalid or expired.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 select-none">
          <div className="p-2 bg-primary rounded-lg">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">WalletWise</span>
        </Link>

        <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground select-none">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Min 8 chars, 1 capital, 1 symbol"
                leftIcon={<Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                leftIcon={<Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
                Update Password
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/20 pt-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors select-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
