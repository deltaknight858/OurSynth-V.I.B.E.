
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailSchema, type EmailSchema } from "@/lib/schemas/authSchemas";
import authService from "@/services/auth";

export default function MagicLinkForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { toast } = useToast();

  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: EmailSchema) => {
    setIsLoading(true);
    setIsEmailSent(false);

    try {
      const { error } = await authService.signInWithMagicLink(values.email);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send magic link. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic link sent!",
          description: "Check your email to sign in.",
        });
        setIsEmailSent(true);
        setSentEmail(values.email);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!sentEmail) return;
    
    setIsLoading(true);
    try {
      const { error } = await authService.signInWithMagicLink(sentEmail);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend magic link.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic link resent!",
          description: "Check your email for the new link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend magic link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-cyan-500/20">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Check your inbox!</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            We've sent a magic link to <span className="font-medium text-cyan-400">{sentEmail}</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Click the link in your email to sign in automatically. The link will expire in 1 hour.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isLoading}
            variant="outline"
            className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Resend Magic Link"
            )}
          </Button>

          <Button
            onClick={() => {
              setIsEmailSent(false);
              setSentEmail("");
              form.setValue("email", "");
            }}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
          >
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold neon-text">Passwordless Sign In</h2>
        <p className="text-gray-300 text-sm">
          Enter your email and we'll send you a secure link to sign in instantly
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    type="email"
                    autoComplete="email"
                    className="bg-white/5 border-white/20 placeholder:text-white/50 text-white focus:border-cyan-400/50 focus:ring-cyan-400/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          No password required • Secure • One-click sign in
        </p>
      </div>
    </div>
  );
}
