
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/auth";
import { AuthError } from "@supabase/supabase-js";
import { LoadingSpinner } from "./LoadingStates";
import { authSchema, AuthSchema } from "@/lib/schemas/authSchemas";

interface EmailPasswordFormProps {
  mode: "signin" | "signup";
  onSuccess?: () => void;
  onToggleMode?: () => void;
}

export default function EmailPasswordForm({
  mode,
  onSuccess,
  onToggleMode,
}: EmailPasswordFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Please enter your email to reset the password.",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await authService.resetPassword(email);
      if (error) throw error;
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const onSubmit = async (values: AuthSchema) => {
    setIsLoading(true);
    try {
      const { error } =
        mode === "signup"
          ? await authService.signUp(values.email, values.password)
          : await authService.signIn(values.email, values.password);

      if (error) throw error;

      toast({
        title: mode === "signup" ? "Account Created" : "Signed In",
        description:
          mode === "signup"
            ? "Welcome! Please check your email to verify your account."
            : "Welcome back!",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: `Error ${mode === "signup" ? "signing up" : "signing in"}`,
        description: authError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  {...field}
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : mode === "signup" ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </Button>

        {mode === "signin" && (
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-sm text-muted-foreground px-0"
              onClick={handlePasswordReset}
              disabled={isResetting}
            >
              {isResetting ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Forgot your password?"
              )}
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={onToggleMode}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
