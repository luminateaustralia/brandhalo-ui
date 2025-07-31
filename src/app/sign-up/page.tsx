import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-[url('/images/bg-pattern.png')] bg-cover bg-center p-12 flex-col justify-center">
        <div className="max-w-lg">
          <span className="inline-block text-[#8777E7] font-semibold mb-4">
            JOIN BRANDHALO
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Brand management for<br />the AI age
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            At <strong>BrandHalo</strong>, we empower leaders with the knowledge and tools to take full control of their brand in the AI-driven world. Our platform provides deep insights into <strong>compliance</strong>, <strong>brand positioning</strong>, and <strong>customer connection</strong>.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8777E7] flex items-center justify-center text-white">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900">Brand Manager</h3>
                <p className="text-gray-600">Design, define and refine your brand with our unique Brand Designer tool.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8777E7] flex items-center justify-center text-white">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900">Compliance Engine</h3>
                <p className="text-gray-600">Track content against major compliance frameworks with AI-powered recommendations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8777E7] flex items-center justify-center text-white">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900">LLM Readiness</h3>
                <p className="text-gray-600">Understand how LLMs perceive your brand and prepare for remediation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Image src="/Logo.svg" alt="BrandHalo" width={205} height={48} className="mx-auto" />
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white shadow-xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-[#8777E7] hover:bg-[#7667d7]",
                footerActionLink: "text-[#8777E7] hover:text-[#7667d7]",
              },
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
            afterSignUpUrl="/onboarding"
            unsafeMetadata={{
              autoJoinDomain: true
            }}
          />
        </div>
      </div>
    </div>
  );
} 