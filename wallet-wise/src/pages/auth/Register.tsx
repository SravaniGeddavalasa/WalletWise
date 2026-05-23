import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { registerSchema } from "../../validations/schemas";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Wallet, Mail, Lock, User, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Register: React.FC = () => {
  const { register: signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await signup(data.name, data.email, data.password, Number(data.age), data.gender);
      addToast("Account created successfully! Welcome to WalletWise.", "success");
      navigate("/dashboard");
    } catch (error: any) {
      addToast(error.message || "Registration failed. Please check your inputs.", "error");
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
        className="w-full max-w-md z-10 animate-in fade-in duration-300"
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
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground select-none">
              Sign up below to start tracking your finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Jane Doe"
                leftIcon={<User className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  placeholder="25"
                  leftIcon={<Calendar className="h-4.5 w-4.5 text-muted-foreground" />}
                  error={errors.age?.message}
                  {...register("age")}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold tracking-tight text-foreground/95 select-none">
                    Gender
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
                      <Users className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <select
                      className={cn(
                        "flex h-11 w-full rounded-xl border border-input bg-background/50 pl-11 pr-3.5 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.gender && "border-destructive focus-visible:ring-destructive"
                      )}
                      defaultValue=""
                      {...register("gender")}
                    >
                      <option value="" disabled className="text-muted-foreground bg-background">Select...</option>
                      <option value="Male" className="bg-background text-foreground">Male</option>
                      <option value="Female" className="bg-background text-foreground">Female</option>
                      <option value="Other" className="bg-background text-foreground">Other</option>
                    </select>
                  </div>
                  {errors.gender?.message && (
                    <span className="text-xs font-medium text-destructive tracking-wide animate-in fade-in-50 duration-200">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, 1 capital, 1 symbol"
                leftIcon={<Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                leftIcon={<Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button type="submit" isLoading={isLoading} fullWidth className="mt-2">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-border/20 pt-4">
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary font-semibold text-foreground transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
