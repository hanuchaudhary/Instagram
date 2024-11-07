"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyCodeSchema } from "@hanuchaudhary/instagram";

export default function VerifyAccount() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      verifyCode : ""
    },
  });

  async function onSubmit(values: z.infer<typeof verifyCodeSchema>) {
    setIsVerifying(true);
    try {
      await axios.post(`${BACKEND_URL}/user/verify`, {
        username,
        verifyCode: values.verifyCode,
      });
      toast.success("Account Verified Successfully!");
      navigate("/auth/signin",{replace : true});
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred during signup";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full mx-2 max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email or phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        {...field}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant={"blue"}
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            disabled
            variant="link"
            className="text-sm text-muted-foreground"
          >
            Didn't receive a code? Resend
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
