import { Menu, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import useNavbarStore from "~/store/navbar";
import { api } from "~/utils/api";
import DialogQrCode from "../dialog-qrcode";
import TextLogo from "../text-logo";
import { ThemeButton } from "../theme-button";
import { Button } from "../ui/button";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export default function Navbar() {
  const { data: sessionData } = useSession();
  const { data: userData } = api.profile.getProfile.useQuery();

  const [isMenuOpen, toggleMenu] = useNavbarStore((state) => [
    state.isMenuOpen,
    state.toggleMenu,
  ]);

  return (
    <div className="sticky top-0 z-10 my-2 flex items-center justify-between space-y-2 border-b bg-white px-8 py-5 shadow-sm dark:bg-background">
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
            <DialogQrCode
              size={{ width: 400, height: 400 }}
              username={userData && userData.username}
            >
              <Button className="hidden sm:flex" variant="outline">
                Share link
              </Button>
            </DialogQrCode>
            <ThemeButton />
            {userData && <UserNav user={userData} />}
          </div>
        ) : (
          <Button onClick={() => void signIn("google")}>Sign in</Button>
        )}
      </div>
    </div>
  );
}
