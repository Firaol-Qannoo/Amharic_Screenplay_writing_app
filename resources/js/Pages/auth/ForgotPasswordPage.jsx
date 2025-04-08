import { Link } from "@inertiajs/react"; // Changed from react-router-dom
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm as useInertiaForm } from "@inertiajs/react"; // Inertia's form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../utils/validation/forgot-password";


export default function ForgotPasswordPage() {
  const { data, setData, post, processing, errors } = useInertiaForm({
    email: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors: validationErrors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: data.email,
    },
  });

  const requestHandler = (formData) => {
    setData("email", formData.email);

    post("/forgot-password", {
      onSuccess: () => {
        setTimeout(() => {
          window.location.href = `/verify-otp?email=${formData.email}`;
        }, 1500);
      },
    });
  };

  return (
    <div className="flex min-h-screen w-[100vw] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you OTP to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(requestHandler)}>
          <div className="space-y-4 rounded-md p-8 shadow-sm">
            <div>
              <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                {...register("email")}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="Email address"
              />
              <p className="text-red-600 self-start text-sm">
                {validationErrors.email?.message || errors.email}
              </p>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
          <Link
              href={"/login"}
              className="font-medium text-primary hover:text-primary/90"
            >
              Log in
            </Link>
        </form>
      </div>
    </div>
  );
}