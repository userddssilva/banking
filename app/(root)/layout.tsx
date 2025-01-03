import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
// import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getSession } from "@/lib/actions/mongodb.users.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const loggedIn = await getLoggedInUser();
  // if(!loggedIn) redirect('/sign-in')

  const loggedIn = await getSession();
  console.log(`layout - LoggedIn: ${loggedIn?._id}`);
  if (!loggedIn) {
    console.log(`layout - LoggedIn: ${loggedIn?._id}, not loggedIn`);
    redirect("/sign-in");
  }

  console.log(`layout - LoggedIn: ${loggedIn._id}`);

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
