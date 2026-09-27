"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (pin !== "00000") {
      toast.error("Invalid PIN", { description: "Please enter the correct 5-digit PIN." });
      setLoading(false);
      return;
    }

    sessionStorage.setItem("adminAuth", "true");
    toast.success("Welcome, Admin!");
    router.push("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="font-orbitron text-2xl">ADMIN ACCESS</CardTitle>
          <CardDescription>Enter the 5-digit PIN to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={5}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="00000"
                required
                className="text-center text-2xl tracking-widest font-orbitron"
              />
            </div>
            <Button type="submit" className="w-full btn-shine" size="xl" disabled={loading || pin.length !== 5}>
              {loading ? "Verifying..." : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
