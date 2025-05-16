import { Link, useForm, usePage } from "@inertiajs/react"; // Inertia hooks
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../utils/validation/signup";
import { useForm as useReactHookForm } from "react-hook-form";
import { useState, useEffect } from "react";
import flasher from '@flasher/flasher';

export default function SignupPage() {
  const { data, setData, post, processing, errors } = useForm({
    profilePicture: null,
    fullname: "",
    email: "",
    username: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const {
    handleSubmit,
    formState,
    register,
    setValue: setZodValue,
  } = useReactHookForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const [showError, setShowError] = useState(false); // State to control visibility of the error popup

  const signupHandler = () => {
    post("/register", {
      forceFormData: true, //  Inertia to handle file uploads properly
    });
  };

  // // Show error popup for 3 seconds if errors exist
  // useEffect(() => {
  //   if (errors && Object.keys(errors).length > 0) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000); // Hide after 3 seconds
  //   }
  // }, [errors]);

   const { messages } = usePage().props;
    
            useEffect(() => {
            if (messages) {
                flasher.render(messages);
            }
            }, [messages]);

  return (
    <div className="flex min-h-screen items-center justify-center w-[100vw] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="font-medium text-primary hover:text-primary/90"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Error message popup */}
        {showError && errors && Object.keys(errors).length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 bg-red-600 text-white rounded-lg shadow-lg">
            <p>{errors.fullname || errors.email || errors.password || errors.confirmPassword}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(signupHandler)}>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <Label htmlFor="profile-picture" className="mb-2 block text-sm font-medium text-gray-700">
                Profile Picture
              </Label>
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                  <AvatarFallback>
                    <Upload className="h-8 w-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setData("profilePicture", file);
                      setZodValue("profilePicture", file);
                    }
                  }}
                />
                <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1 text-white">
                  <Upload className="h-4 w-4" />
                </div>
              </div>
              <p className="text-red-600 self-start text-sm">
                {formState.errors.profilePicture?.message}
              </p>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                {...register("fullname")}
                value={data.fullname}
                onChange={(e) => {
                  setData("fullname", e.target.value);
                }}
                placeholder="Full name"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.fullname?.message || errors.fullname}
              </p>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                {...register("email")}
                value={data.email}
                onChange={(e) => {
                  setData("email", e.target.value);
                }}
                type="email"
                placeholder="Email address"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.email?.message}
              </p>
            </div>

            {/* Username and Role */}
            <div className="flex gap-4">
              <div>
                <Label htmlFor="username">Username (optional)</Label>
                <Input
                  id="username"
                  {...register("username")}
                  value={data.username}
                  onChange={(e) => {
                    setData("username", e.target.value);
                  }}
                  placeholder="Username"
                />
                <p className="text-red-600 text-sm">
                  {formState.errors.username?.message}
                </p>
              </div>
              <div>
                <Label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role ( *optional)
                </Label>
                <select className="border-2 border-black/10 rounded-xl px-1 py-2"  {...register("role")} name="role" id="role">
                  <option disabled value=""> - select -</option>
                  <option value="writer">Writer</option>
                  <option value="writer">Director</option>
                  <option value="writer">Storyboard Designer</option>
                </select>
               
                <p className="text-red-600 self-start  text-sm">
                  {formState.errors.role && formState.errors.role.message}
                </p>
              </div>
             
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register("password")}
                value={data.password}
                onChange={(e) => {
                  setData("password", e.target.value);
                }}
                type="password"
                placeholder="Password"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.password?.message || errors.password}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword")}
                value={data.confirmPassword}
                onChange={(e) => {
                  setData("confirmPassword", e.target.value);
                }}
                type="password"
                placeholder="Confirm password"
              />
              <p className="text-red-600 text-sm">
                {formState.errors.confirmPassword?.message}
              </p>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={processing}>
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}