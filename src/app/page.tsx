import Link from 'next/link';
import Image from 'next/image';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

export const runtime = 'edge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                
                  <Image src="/Logo.svg" alt="BrandHalo" width={205} height={48} />
                
               
              </div>
            </div>
            <div className="flex items-center">
              <SignedIn>
                <Link 
                  href="/dashboard"
                  className="ml-4 px-6 py-2 rounded-full text-sm font-medium text-white bg-[#8777E7] hover:bg-[#7667d7] transition-colors"
                >
                  Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <Link 
                  href="/sign-in"
                  className="ml-4 px-6 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <SignUpButton>
                  <button className="ml-4 px-6 py-2 rounded-full text-sm font-medium text-white bg-[#FF8B4E] hover:bg-[#ff7b3e] transition-colors">
                    Register Interest
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 bg-[url('/images/bg-pattern.png')] bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block text-[#8777E7] font-semibold mb-4">
              LAUNCHING SOON
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Brand management for<br />the AI age
            </h1>
            <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              At <strong>BrandHalo</strong>, we empower leaders with the knowledge and tools to take full control of their brand in the AI-driven world. Our platform provides deep insights into <strong>compliance</strong>, <strong>brand positioning</strong>, and <strong>customer connection</strong>.
            </p>
            <div className="flex justify-center gap-4">
              <SignUpButton>
                <button className="px-8 py-3 rounded-full text-white bg-[#8777E7] hover:bg-[#7667d7] transition-colors font-medium">
                  Register
                </button>
              </SignUpButton>
              <button className="px-8 py-3 rounded-full text-[#8777E7] border border-[#8777E7] hover:bg-[#8777E7] hover:text-white transition-colors font-medium">
                Discover
              </button>
            </div>
          </div>
          
          <div className="mt-16 mb-24">
            <div className="relative w-4/5 mx-auto">
              <Image
                src="/dashboard.png"
                alt="BrandHalo Dashboard"
                width={1200}
                height={754}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-gray-600">
              Proven to improve conversion, eradicate risk and drive better customer experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Brand Manager',
                description: 'Design, define and refine your brand. Define your goals, markets and geographies to understand how you present and talk about your brand. Detect changes in tone, positioning and messaging with our unique Brand Designer tool.'
              },
              {
                icon: '👥',
                title: 'Persona Manager',
                description: 'Design, define and refine your personas. Design and create active stakeholder profiles within BrandHalo. We then use them to derive insights and recommendations for your content. We also provide an API for downstream AI context and prompt management.'
              },
              {
                icon: '✓',
                title: 'Compliance',
                description: 'Our compliance engine checks every piece of content you publish and tracks it against the major compliance frameworks. Giving you peace of mind, and AI powered recommendations on how to rectify any potential breaches.'
              },
              {
                icon: '🤖',
                title: 'LLM Readiness',
                description: 'We ask key LLMs including OpenAI, Clause and Gemini, the common questions asked by your buyers to understand what the LLMs are saying about your brand. We then identify inaccuracies and prepare you for remediation.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-lg bg-[rgba(135,119,231,0.1)] hover:bg-[rgba(135,119,231,0.15)] transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#191C20] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image src="/images/logo-white.png" alt="BrandHalo" width={32} height={32} />
              <div className="ml-4">
                <h4 className="text-2xl font-bold">BrandHalo</h4>
                <p className="text-sm opacity-70">© 2024 BrandHalo</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
