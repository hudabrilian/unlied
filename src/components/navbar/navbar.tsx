import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import TextLogo from "../text-logo";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserNav } from "./user-nav";
import { MainNav } from "./main-nav";
import { Menu, X } from "lucide-react";
import useNavbarStore from "~/store/navbar";

const DynamicQRCodeShare = dynamic(() => import("../qrcode"), {
  ssr: false,
});

export default function Navbar() {
  const { data: sessionData } = useSession();
  const { data: userData } = api.profile.getProfile.useQuery();

  const [isMenuOpen, toggleMenu] = useNavbarStore((state) => [
    state.isMenuOpen,
    state.toggleMenu,
  ]);

  return (
    <div className="sticky top-0 z-10 my-2 flex items-center justify-between space-y-2 border-b bg-white px-8 py-5 shadow-sm">
      <div className="flex items-center space-x-8">
        <button onClick={toggleMenu} className="flex sm:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <TextLogo className="mr-4" />
        <MainNav username={userData && userData.username} />
      </div>
      <div className="flex items-center space-x-2">
        {sessionData ? (
          <div className="flex space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="hidden sm:flex">Share link</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {userData && userData.username ? (
                    <>
                      <DialogTitle>Here your QR Code</DialogTitle>
                      <DialogDescription>
                        <span>
                          Share to your friends. Make them confess to you!
                        </span>
                      </DialogDescription>
                      <DynamicQRCodeShare
                        size={{
                          width: 400,
                          height: 400,
                        }}
                        username={userData.username}
                        link={`${env.NEXT_PUBLIC_BASE_URL}/@${userData.username}`}
                      />
                    </>
                  ) : (
                    <p>Set your username first</p>
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {userData && <UserNav user={userData} />}
          </div>
        ) : (
          <Button onClick={() => void signIn("google")}>Sign in</Button>
        )}
      </div>
    </div>
  );
}
