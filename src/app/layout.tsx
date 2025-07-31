import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApiProvider } from '@/contexts/ApiContext';
import { Providers } from '@/components/Providers';
import { 
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
  CreateOrganization
} from '@clerk/nextjs';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandHalo",
  description: "Brand monitoring and analysis platform",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/Roundel.svg', type: 'image/svg+xml' },
    ],
    apple: '/Roundel.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            <ApiProvider>
              {children}
            </ApiProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
