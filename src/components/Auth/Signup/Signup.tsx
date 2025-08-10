"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { postRegister } from "@/services/Common/Auth/authServices";
import Cookies from "js-cookie";

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  roleName: string;
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleName: z.string().min(3, "Role name must be at least 3 characters"),
});

export function Signup({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [form, setForm] = useState<IRegisterBody>({
    email: "",
    password: "",
    name: "",
    roleName: "user",
  });
  const [errors, setErrors] = useState<Partial<IRegisterBody>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const postRegisterFn = async (requestBody: IRegisterBody) => {
    try {
      const response = await postRegister(requestBody);
      Cookies.set("authToken", response.accessToken);
      router.push("/")
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<IRegisterBody> = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof IRegisterBody;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Form Data:", result.data);
    postRegisterFn(result.data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Join Acme Inc in just a few steps
                </p>
              </div>

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Role */}
              <div className="grid gap-2">
                <Label htmlFor="roleName">Role</Label>
                <Input
                  id="roleName"
                  name="roleName"
                  type="text"
                  placeholder="user / admin / superadmin"
                  value={form.roleName}
                  onChange={handleChange}
                />
                {errors.roleName && (
                  <p className="text-red-500 text-sm">{errors.roleName}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>

          {/* Image Section */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://img.freepik.com/free-vector/purple-neon-lined-pattern-dark-background-vector_53876-173381.jpg?semt=ais_hybrid&w=740"
              alt="Signup Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
