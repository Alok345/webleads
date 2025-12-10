"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Firebase functions
import { loginWithEmail, getUserData } from "@/lib/firebase";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔥 Auto-redirect if user is already logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, []);

  async function handleEmailLogin(e) {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // 1. Firebase login
      const result = await loginWithEmail(email, password);
      const uid = result.user.uid;

      // 2. Fetch extra data from Firestore
      const userInfo = await getUserData(uid);

      if (!userInfo) {
        alert("User data not found in Firestore.");
        return;
      }

      // 3. Save user session
      localStorage.setItem("token", uid);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // 4. Redirect to dashboard
      router.push("/dashboard");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleEmailLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Checking..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="https://media.licdn.com/dms/image/v2/D560BAQFTdg2JWaNk4A/company-logo_200_200/B56ZVrCAS9HsAI-/0/1741257442946/ad2click_media_logo?e=2147483647&v=beta&t=dBwJsjKSb5QPcazsRjnQRW1AjPIxv0X55SK0UiIvCho"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms & Privacy Policy.
      </div>
    </div>
  );
}
