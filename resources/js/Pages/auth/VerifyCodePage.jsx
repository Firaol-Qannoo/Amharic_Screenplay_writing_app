import {Link, useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useForm } from "react-hook-form"
import { verifyCodeSchema } from "../../utils/validation/verify-code"
import { zodResolver } from "@hookform/resolvers/zod"
export default function VerifyCodePage() {
  const navigate = useNavigate()
const verifyHandler = (data)=>{
  console.log(data)
 data && navigate('/reset-password')
}
  const { handleSubmit, register,formState} = useForm({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onChange",
  });
  return (
    <div className="flex min-h-screen w-[100vw] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a verification code to your email address. Please enter it below.
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4 p-8 rounded-md shadow-sm">
            <div className="flex justify-center flex-col items-center gap-6">
              <Label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                Verification Code
              </Label>
              <InputOTP {...register("code")} maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
            </div>
          </div>
          <p className="text-red-600 self-start  text-sm">
                {formState.errors.code && formState.errors.code.message}
              </p>
          <div>
            <Button onClick={handleSubmit(verifyHandler)} type="submit" className="w-full">
              Verify
            </Button>
          </div>
          <div className="text-center text-sm">
            Didn&apos;t receive a code?{" "}
            <button type="button" className="font-medium text-primary hover:text-primary/90">
              Resend
            </button>
          </div>
          <div className="text-center text-sm">
            <Link to={'/login'} className="font-medium text-primary hover:text-primary/90">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

