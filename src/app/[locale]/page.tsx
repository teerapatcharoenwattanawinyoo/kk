import { ROUTES } from "@/lib/constants";
import type { Locale } from "@/middleware";
import { redirect } from "next/navigation";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  redirect(`/${locale}${ROUTES.SIGN_IN}`);
}
