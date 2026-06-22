"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_CREDENTIALS } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, token, login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (user && token) router.replace("/dashboard");
  }, [user, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, remember);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      toast.error("Login failed", result.error);
      return;
    }
    toast.success("Welcome back", "You're signed in to the admin portal.");
    router.replace("/dashboard");
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForgotSent(true);
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex items-center justify-center p-4">
      {/* ambient background, matching storefront hero treatment */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center text-white font-black text-xl">
            H
          </div>
          <div>
            <div className="text-base font-bold text-text font-display leading-tight">PT. HI-TECH</div>
            <div className="text-[11px] text-text-3 leading-tight tracking-wide">ADMIN PORTAL</div>
          </div>
        </div>

        <div className="bg-bg-2/80 backdrop-blur-xl border border-border rounded-[24px] p-8 shadow-2xl">
          {!forgotMode ? (
            <>
              <h1 className="font-display text-2xl font-bold text-text mb-1.5">Sign in to your dashboard</h1>
              <p className="text-sm text-text-2 mb-6">Manage products, categories, and brands for the storefront.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Input
                    label="Email address"
                    required
                    type="email"
                    placeholder="admin@pthitech.co.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                  <Mail className="w-4 h-4 text-text-3 absolute left-3.5 top-[34px]" />
                </div>

                <div className="relative">
                  <Input
                    label="Password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-text-3 absolute left-3.5 top-[34px]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-[32px] text-text-3 hover:text-text-2 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <div className="text-xs text-red bg-red/10 border border-red/30 rounded-lg px-3 py-2.5">{error}</div>
                )}

                <div className="flex items-center justify-between -mt-1">
                  <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-xs font-semibold text-blue-2 hover:text-blue-3 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" size="lg" loading={loading} className="w-full justify-center mt-1">
                  Sign In →
                </Button>
              </form>

              <button
                onClick={fillDemo}
                type="button"
                className="w-full mt-5 flex items-center gap-2.5 justify-center text-xs text-text-2 border border-border rounded-xl py-3 hover:border-border-2 hover:text-text transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-2" />
                Use demo admin credentials
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setForgotMode(false);
                  setForgotSent(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-text-2 hover:text-text mb-5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </button>

              {!forgotSent ? (
                <>
                  <h1 className="font-display text-2xl font-bold text-text mb-1.5">Reset your password</h1>
                  <p className="text-sm text-text-2 mb-6">
                    Enter the email associated with your admin account and we&apos;ll send a reset link.
                  </p>
                  <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                    <Input
                      label="Email address"
                      required
                      type="email"
                      placeholder="admin@pthitech.co.id"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                    <Button type="submit" size="lg" className="w-full justify-center">
                      Send Reset Link →
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-green" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-text mb-2">Check your inbox</h2>
                  <p className="text-sm text-text-2">
                    If an account exists for <span className="text-text font-medium">{forgotEmail}</span>, a reset link is on
                    its way. (Demo only — no email is actually sent.)
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-text-3 mt-6">
          Demo credentials — Email: <span className="text-text-2">{DEMO_CREDENTIALS.email}</span> · Password:{" "}
          <span className="text-text-2">{DEMO_CREDENTIALS.password}</span>
        </p>
      </div>
    </div>
  );
}
