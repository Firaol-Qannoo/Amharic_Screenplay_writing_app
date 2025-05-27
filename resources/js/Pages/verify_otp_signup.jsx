import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function OtpVerification({ email, flash, errors }) {
  const { data, setData, post, processing } = useForm({
    email: email || "",
    otp: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/verify-signup-otp");
  };

  return (
    <div className="flex items-center justify-center bg-white h-screen">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md w-[400px] space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Verify Your Email</h2>

        {/* Display flash success message if available */}
        {flash?.success && (
          <p className="text-green-600 text-sm text-center">{flash.success}</p>
        )}

        {/* Display any error messages */}
        {flash?.error && (
          <p className="text-red-600 text-sm text-center">{flash.error}</p>
        )}

        {/* Display OTP label */}
        <Label htmlFor="otp" className="text-sm text-gray-600">
          Enter the Code sent to {data.email}
        </Label>
        <Input
          id="otp"
          type="text"
          value={data.otp}
          onChange={(e) => setData("otp", e.target.value)}
          placeholder="Enter Code"
          className="w-full border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        />
        {/* Safe access to errors object */}
        {errors?.otp && <p className="text-red-600 text-sm">{errors.otp}</p>}

        <Button type="submit" disabled={processing} className="w-full bg-primary text-white hover:bg-primary-700">
          Verify Code
        </Button>
      </form>
    </div>
  );
}