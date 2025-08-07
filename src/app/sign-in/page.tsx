import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Footer from '@/components/Footer';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Image 
                src="/Logo.svg" 
                alt="BrandHalo" 
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to BrandHalo
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>
          
          <SignIn
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
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
} 