import { CreateOrganization } from "@clerk/nextjs";

export default function OrganizationSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set up your organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create or join an organization to get started
          </p>
        </div>
        
        <CreateOrganization 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            },
          }}
          afterCreateOrganizationUrl="/dashboard"
          afterJoinOrganizationUrl="/dashboard"
        />
      </div>
    </div>
  );
} 