import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/config/config";
import { signupSchema } from "@hanuchaudhary/instagram";

export default function Component() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => !prev);
  };

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        ...values,
      });
      toast.success(`Welcome, ${response.data.username}! Your account has been successfully created.`);
      navigate(`/auth/verify/${response.data.username}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred during signup";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-sm mx-2 space-y-4">
        <Card className="rounded shadow-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <img
                className="w-44 dark:invert-[1]"
                src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
                alt="Instagram"
              />
            </div>
            <p className="text-sm text-muted-foreground px-8">
              Sign up to see photos and videos from your friends.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="blue">
              <Facebook className="mr-2 h-4 w-4" />
              Log in with Facebook
            </Button>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
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
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={`${passwordVisibility ? "text" : "password"}`}
                            placeholder="Password"
                            {...field}
                          />
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisibility ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center px-6">
                    People who use our service may have uploaded your contact
                    information to Instagram.{" "}
                    <a href="#" className="text-blue-500">
                      Learn More
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground text-center px-6">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-blue-500">
                      Terms
                    </a>
                    ,{" "}
                    <a href="#" className="text-blue-500">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-500">
                      Cookies Policy
                    </a>
                    .
                  </p>
                </div>
                <Button
                  variant="blue"
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="text-center py-4">
            <p className="text-sm">
              Have an account?{" "}
              <Link to="/auth/signin" className="text-blue-500 font-semibold">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
