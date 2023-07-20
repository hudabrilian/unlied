import { type ReactNode } from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import { Toaster } from "../ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
