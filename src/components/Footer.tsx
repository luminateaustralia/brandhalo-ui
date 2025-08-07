import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Brand Manager', href: '/' },
      { name: 'Persona Manager', href: '/' },
      { name: 'Compliance', href: '/' },
      { name: 'Analytics', href: '/' },
      { name: 'Channels', href: '/' },
    ],
    company: [
      { name: 'About Us', href: '/' },
      { name: 'Careers', href: '/' },
      { name: 'Contact', href: '/' },
      { name: 'Blog', href: '/' },
      { name: 'Press', href: '/' },
    ],
    resources: [
      { name: 'Documentation', href: '/' },
      { name: 'Help Center', href: '/' },
      { name: 'Community', href: '/' },
      { name: 'API Reference', href: '/' },
      { name: 'Status', href: '/' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/' },
      { name: 'Terms of Service', href: '/' },
      { name: 'Cookie Policy', href: '/' },
      { name: 'Security', href: '/' },
      { name: 'GDPR', href: '/' },
    ],
  };

  const socialLinks = [
    {
      name: 'Twitter',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0B0D11] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image 
                    src="/Logo.svg" 
                    alt="BrandHalo" 
                    width={82} 
                    height={19}
                    className="h-5 w-auto brightness-0 invert"
                  />
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-sm">
                Empowering leaders with the knowledge and tools to take full control of their brand in the AI-driven world.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-[#8777E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hello@brandhalo.io" className="hover:text-[#8777E7] transition-colors duration-200">hello@brandhalo.io</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-[#8777E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Crafted in Brisbane & Wolloongong</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-white">Product</h4>
              <ul className="space-y-6">
                {footerLinks.product.map((link) => (
                  <li key={link.name} className="relative group">
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-[#8777E7] transition-colors duration-200 text-sm block"
                    >
                      {link.name}
                    </Link>
                    <span className="absolute left-0 -bottom-6 px-2 py-1 text-xs bg-[#8777E7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Coming Soon
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-6">
                {footerLinks.company.map((link) => (
                  <li key={link.name} className="relative group">
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-[#8777E7] transition-colors duration-200 text-sm block"
                    >
                      {link.name}
                    </Link>
                    <span className="absolute left-0 -bottom-6 px-2 py-1 text-xs bg-[#8777E7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Coming Soon
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-white">Resources</h4>
              <ul className="space-y-6">
                {footerLinks.resources.map((link) => (
                  <li key={link.name} className="relative group">
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-[#8777E7] transition-colors duration-200 text-sm block"
                    >
                      {link.name}
                    </Link>
                    <span className="absolute left-0 -bottom-6 px-2 py-1 text-xs bg-[#8777E7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Coming Soon
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4 pb-4">
              <h4 className="text-lg font-semibold text-white">Legal</h4>
              <ul className="space-y-6">
                {footerLinks.legal.map((link) => (
                  <li key={link.name} className="relative group">
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-[#8777E7] transition-colors duration-200 text-sm block"
                    >
                      {link.name}
                    </Link>
                    <span className="absolute left-0 -bottom-6 px-2 py-1 text-xs bg-[#8777E7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Coming Soon
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="max-w-md">
                <h4 className="text-lg font-semibold text-white mb-2">Stay updated</h4>
                <p className="text-gray-300 text-sm">
                  Get the latest updates on new features, industry insights, and platform improvements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-none">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8777E7] focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-[#8777E7] to-[#7667d7] text-white font-medium rounded-lg hover:from-[#7667d7] hover:to-[#6557c7] transition-all duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                © {currentYear} BrandHalo. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-sm hidden sm:block">Follow us:</span>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <div key={social.name} className="relative group">
                      <a
                        href={social.href}
                        className="text-gray-400 hover:text-[#8777E7] transition-colors duration-200 block"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-[#8777E7] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Coming Soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;