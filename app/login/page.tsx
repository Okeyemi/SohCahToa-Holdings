"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground">

        <div className="flex items-center gap-3 bg-white  rounded-md w-max">
          <Image
            src="/logo.png"
            alt="SohCahToa"
            width={140}
            height={40}
            priority
          />
        </div>

        <div className="max-w-sm">
          <h1 className="text-3xl font-bold leading-tight">
            Transaction Monitoring Dashboard
          </h1>

          <p className="mt-3 text-sm text-primary-foreground/80">
            Securely monitor transactions, detect anomalies,
            and manage financial operations from one place.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} SohCahToa Holdings
        </p>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="flex items-center justify-center bg-muted/40 p-6">

        <Card className="w-full max-w-md shadow-xl">

          <CardHeader className="space-y-2 text-center">

            <Image
              src="/logo.png"
              alt="SohCahToa"
              width={120}
              height={40}
              className="mx-auto"
            />

            <CardTitle className="text-xl font-semibold">
              Admin Login
            </CardTitle>

            <CardDescription>
              Sign in to access the dashboard
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form onSubmit={handleLogin} className="space-y-4">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>

                <Input
                  type="email"
                  placeholder="admin@finance.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Password
                </label>

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}