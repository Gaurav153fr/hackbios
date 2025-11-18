// app/profile/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileCLient";

interface Props {
    params: Promise<{ id: string }>; // important
  }
export default async function Page({ params }: Props) {
    const data = await params;
    console.log("Fetching user with ID:", data.id, );
    
  const user = await prisma.user.findUnique({
    where: { id: data.id },
    select: {
      id: true,
      fullName: true,
      workEmail: true,
      mobilePhone: true,
      legalCompanyName: true,
      country: true,
    },
  });

  if (!user) {
    return <div className="p-6 text-red-600">User not found.</div>;
  }

  return <ProfileClient user={user} />;

}
