import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { loginSchema } from "../../validations/schemas";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Wallet, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      addToast("Successfully logged in!", "success");
      navigate(from, { replace: true });
    } catch (error: any) {
      addToast(error.message || "Invalid credentials. Please try again.", "error");
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground select-none">
              Login to manage your budgets and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold tracking-tight text-foreground/95 select-none">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline hover:text-primary/90"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>

              <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/20 pt-4">
            <p className="text-center text-sm text-muted-foreground w-full">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="underline underline-offset-4 hover:text-primary font-semibold text-foreground transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
