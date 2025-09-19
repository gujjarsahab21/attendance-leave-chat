import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function PendingApproval() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Registration Submitted!
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Your registration details have been successfully submitted.  
          Please wait while our Admin/HR team reviews your application.
        </p>


        <p className="text-xs text-gray-400">
          You’ll receive an email once your account is approved.  
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
