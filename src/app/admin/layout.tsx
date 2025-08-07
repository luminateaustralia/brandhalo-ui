import { auth } from '@clerk/nextjs/server';
import { SidebarProvider } from '@/contexts/SidebarContext';
import AdminContent from './AdminContent';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication - automatically redirects if not signed in
  // The middleware already handles the redirect, but this provides an extra layer of protection
  await auth.protect();

  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}