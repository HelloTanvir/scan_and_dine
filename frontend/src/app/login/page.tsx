"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Lock, User, Shield, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default to admin
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect based on role
      if (role === "kitchen") {
        router.push("/kitchen");
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-600 p-3 mr-3">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-900">Scan & Dine</h1>
          </div>
          <p className="text-green-700">Restaurant Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Staff Login</CardTitle>
            <CardDescription className="text-green-600">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Selection Buttons */}
              <div className="space-y-2">
                <Label className="text-green-800">Select Your Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRole("admin")}
                    className={cn(
                      "h-16 flex flex-col items-center justify-center space-y-1 border-2 transition-all",
                      role === "admin"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-green-200 hover:border-green-300 text-green-600"
                    )}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">Admin</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRole("kitchen")}
                    className={cn(
                      "h-16 flex flex-col items-center justify-center space-y-1 border-2 transition-all",
                      role === "kitchen"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-green-200 hover:border-green-300 text-green-600"
                    )}
                  >
                    <ChefHat className="h-5 w-5" />
                    <span className="text-sm font-medium">Kitchen Staff</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-green-700">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-green-600">
                Need help?{" "}
                <a href="#" className="font-medium text-green-700 hover:text-green-600">
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
