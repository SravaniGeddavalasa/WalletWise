import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Wallet, KeyRound, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const verifyOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers"),
});

export const VerifyOtp: React.FC = () => {
  const { verifyOtp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: any) => {
    if (!email) {
      addToast("Email is missing. Please restart the password recovery process.", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyOtp(email, data.otp);
      addToast("OTP verified successfully", "success");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp)}`);
    } catch (error: any) {
      addToast(error.message || "Failed to verify OTP.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Missing email parameter.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/forgot-password">
              <Button>Back to Forgot Password</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
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
              Verify OTP
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground select-none">
              Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="6-Digit OTP"
                type="text"
                placeholder="123456"
                maxLength={6}
                leftIcon={<KeyRound className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.otp?.message}
                {...register("otp")}
              />

              <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
                Verify Code
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

export default VerifyOtp;
