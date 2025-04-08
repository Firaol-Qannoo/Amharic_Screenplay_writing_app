import { Link, useForm } from "@inertiajs/react"; // Inertia hooks
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "../../utils/validation/reset-password"; // your Zod validation schema
import { useForm as useReactHookForm } from "react-hook-form"; // React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"; // Zod Resolver

export default function ResetPasswordPage() {
  const { data, setData, post, processing, errors } = useForm({
    password: "",
    confirmPassword: "",
  });

  // Initialize react-hook-form with Zod validation
  const {
    handleSubmit,
    register,
    formState,
    setValue: setZodValue,
  } = useReactHookForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const resetHandler = (data) => {
    post("/reset-password", {
      data: data,
      onSuccess: () => {
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login after success
        }, 2000);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-[100vw] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below to reset your account password.
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(resetHandler)} // Use handleSubmit from react-hook-form
        >
          <div className="space-y-4 p-8 rounded-md shadow-sm">
            {/* New Password */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </Label>
              <Input
                {...register("password")} // Register the input with react-hook-form
                id="password"
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)} // Inertia state update
                required
                className="mt-1"
                placeholder="New password"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.password?.message || errors.password} {/* Display validation errors */}
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </Label>
              <Input
                {...register("confirmPassword")} // Register the input with react-hook-form
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={data.confirmPassword}
                onChange={(e) => setData("confirmPassword", e.target.value)} // Inertia state update
                required
                className="mt-1"
                placeholder="Confirm new password"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.confirmPassword?.message || errors.confirmPassword} {/* Display validation errors */}
              </p>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={processing}>
              Reset Password
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}