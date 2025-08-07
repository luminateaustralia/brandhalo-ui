import { auth } from '@clerk/nextjs/server';
import { SidebarProvider } from '@/contexts/SidebarContext';
import DashboardContent from '@/app/dashboard/DashboardContent';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication - automatically redirects if not signed in
  // The middleware already handles the redirect, but this provides an extra layer of protection
  await auth.protect();

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
} 