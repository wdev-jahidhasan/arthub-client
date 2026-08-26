import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const role = session?.user?.role || 'user';
  
  if (role === 'admin') redirect('/dashboard/admin');
  if (role === 'artist') redirect('/dashboard/artist');
  redirect('/dashboard/user');
}