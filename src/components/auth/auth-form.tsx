"use client";

import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE } from "@/types/api";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE),
});

type FormValues = z.infer<typeof signinSchema> & z.infer<typeof signupSchema>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type AnyRegister = any;

function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  disabled,
  register,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  disabled?: boolean;
  register: AnyRegister;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  );
}

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isSignup = mode === "signup";
  const loading = loginMutation.isPending || registerMutation.isPending;

  const schema = isSignup ? signupSchema : signinSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
  });

  const onSubmit = (data: FormValues) => {
    if (isSignup) {
      registerMutation.mutate({
        name: data.name!,
        email: data.email,
        password: data.password,
      });
    } else {
      loginMutation.mutate({
        email: data.email,
        password: data.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {isSignup && (
        <AuthField
          id="name"
          label="Full name"
          placeholder="John Doe"
          icon={User}
          error={errors.name?.message}
          register={register}
          disabled={loading}
        />
      )}

      <AuthField
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        error={errors.email?.message}
        register={register}
        disabled={loading}
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        placeholder={isSignup ? "Create a strong password" : "Enter your password"}
        icon={Lock}
        error={errors.password?.message}
        register={register}
        disabled={loading}
      />

      {!isSignup && (
        <div className="flex items-center justify-end">
          <Link
            href="#"
            className="text-[12px] text-foreground-muted transition-colors hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading
          ? "Please wait..."
          : isSignup
            ? "Create account"
            : "Sign in"}
      </button>

      <div className="flex items-center gap-3 py-2">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-foreground-muted">or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-foreground shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-muted/50"
      >
        <span className="flex size-5 items-center justify-center rounded-sm bg-foreground text-[10px] font-bold text-background">
          G
        </span>
        Continue with Google
      </button>

      <p className="text-center text-[13px] text-foreground-secondary pt-2">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignup ? "/auth" : "/auth?mode=signup"}
          className="font-semibold text-foreground hover:underline"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </form>
  );
}
