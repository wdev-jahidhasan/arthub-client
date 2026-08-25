import { auth } from "@/lib/auth"; // আপনার auth.js ফাইল থেকে
import { headers } from "next/headers";
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Better-Auth ব্যবহার করলে এভাবে সেশন পেতে পারেন:
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const role = session?.user?.role || 'user';

  // রোল অনুযায়ী রিডাইরেক্ট
  if (role === 'admin') redirect('/dashboard/admin');
  if (role === 'artist') redirect('/dashboard/artist');
  redirect('/dashboard/user');
}