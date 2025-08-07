'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { useState } from 'react';
import Footer from '@/components/Footer';

export const runtime = 'edge';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/sign-ups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          signup_url: window.location.href
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thanks! You\'ll be the first to know when we launch.');
        setEmail('');
      } else if (response.status === 409) {
        setMessage('You\'re already on our list!');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/BG.png')] bg-cover bg-center bg-fixed">
      {/* Navigation */}
      <nav className="w-full pt-4">
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
      <div className="pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
            {/* Content Column - Left */}
            <div className="text-left">
              <span className="inline-block text-[#8777E7] font-semibold mb-4">
                LAUNCHING SOON
              </span>
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tighter">
                Brand management for the AI age
              </h1>
              <p className="mt-3 text-xl text-gray-600 mb-8">
                At <strong>BrandHalo</strong>, we empower leaders with the knowledge and tools to take full control of their brand in the AI-driven world. Our platform provides deep insights into <strong>compliance</strong>, <strong>brand positioning</strong>, and <strong>customer connection</strong>.
              </p>
              <form onSubmit={handleSubmit} className="max-w-md">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-full border border-[#8777E7] focus:outline-none focus:ring-2 focus:ring-[#8777E7] focus:border-transparent disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full text-white bg-[#8777E7] hover:bg-[#7667d7] transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Register for updates →'}
                  </button>
                </div>
                {message && (
                  <p className={`mt-3 text-sm ${message.includes('Thanks') || message.includes('already') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
            
            {/* Image Column - Right */}
            <div className="relative">
              {/* Browser Frame */}
              <div className="bg-gray-800 rounded-t-xl p-3 shadow-2xl">
                {/* Browser Header */}
                <div className="flex items-center justify-between mb-0">
                  {/* Traffic Light Buttons */}
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  
                  {/* Address Bar */}
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-300 text-center">
                      platform.brandhalo.io
                    </div>
                  </div>
                  
                  {/* Menu Dots */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Image */}
              <div className="bg-white rounded-b-xl shadow-2xl overflow-hidden">
                <Image
                  src="/home-dashboard.png"
                  alt="BrandHalo Dashboard"
                  width={1200}
                  height={754}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why BrandHalo Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why BrandHalo?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We help brand, marketing and digital leaders take control of their brand. Our suite of tools helps you create and manage how your brand is delivered to market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Be true Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8777E7] to-[#7667d7] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be true.</h3>
              <p className="text-gray-600 leading-relaxed">
                How you position yourself to the outside world is crucial. Your people, assets and market is shaped by your brand. Get it right, aligned and keep it up to date with BrandHalo.
              </p>
            </div>

            {/* Be connected Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8B4E] to-[#ff7b3e] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be connected.</h3>
              <p className="text-gray-600 leading-relaxed">
                Your website and social media channels are the gateway to achieving lifetime customers. As content launches, evolves and ages, it&apos;s important to ensure its relevant to your audience.
              </p>
            </div>

            {/* Be compliant Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be compliant.</h3>
              <p className="text-gray-600 leading-relaxed">
                As brands experience the evolution of their industry, regulation is critical to delivering customer experiences. Whether it&apos;s financial services, healthcare or pharmaceuticals. Compliance is everything.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Features</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Proven to improve conversion, eradicate risk and drive better customer experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Brand Manager Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8777E7] to-[#7667d7] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Brand Manager</h3>
              <p className="text-gray-600 leading-relaxed">
                Design, define and refine your brand. Define your goals, markets and geographies to understand how you present and talk about your brand. Detect changes in tone, positioning and messaging with our unique Brand Designer tool.
              </p>
            </div>

            {/* Persona Manager Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8B4E] to-[#ff7b3e] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Persona Manager</h3>
              <p className="text-gray-600 leading-relaxed">
                Design, define and refine your personas. Design and create active stakeholder profiles within BrandHalo. We then use them to derive insights and recommendations for your content. We also provide an API for downstream AI context and prompt management.
              </p>
            </div>

            {/* Compliance Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                Our compliance engine checks every piece of content you publish and tracks it against the major compliance frameworks. Giving you peace of mind, and AI powered recommendations on how to rectify any potential breaches.
              </p>
            </div>

            {/* LLM Readiness Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">LLM Readiness</h3>
              <p className="text-gray-600 leading-relaxed">
                We ask key LLMs including OpenAI, Clause and Gemini, the common questions asked by your buyers to understand what the LLMs are saying about your brand. We then identify inaccuracies and prepare you for remediation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
