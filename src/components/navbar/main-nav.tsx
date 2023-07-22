import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import useNavbarStore from "~/store/navbar";
import { Button } from "../ui/button";
import { cn } from "~/utils/utils";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import dynamic from "next/dynamic";
import { env } from "~/env.mjs";

interface MainNav {
  href: string;
  title: string;
}

const items: MainNav[] = [
  {
    href: "/confessions",
    title: "Confessions",
  },
  {
    href: "/questions",
    title: "Questions",
  },
];

const DynamicQRCodeShare = dynamic(() => import("../qrcode"), {
  ssr: false,
});

interface Props {
  username?: string | null | undefined;
}

export function MainNav({ username }: Props) {
  const pathname = usePathname();

  const [isMenuOpen, toggleMenu] = useNavbarStore((state) => [
    state.isMenuOpen,
    state.toggleMenu,
  ]);

  return (
    <>
      <div
        className={cn(
          "absolute -left-8 top-[89px] z-20 w-full flex-col space-y-2 bg-white px-8 py-6 shadow-md transition-all duration-150 ease-in-out sm:hidden",
          isMenuOpen ? "flex" : "hidden"
        )}
      >
        {items.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={pathname === item.href ? "bg-slate-100" : ""}
            asChild
          >
            <Link href={item.href} onClick={toggleMenu}>
              {item.title}
            </Link>
          </Button>
        ))}
        <Separator />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Share link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              {username ? (
                <div>
                  <DialogTitle>Here your QR Code</DialogTitle>
                  <DialogDescription>
                    <span>
                      Share to your friends. Make them confess to you!
                    </span>
                  </DialogDescription>
                  <DynamicQRCodeShare
                    size={{
                      width: 300,
                      height: 300,
                    }}
                    username={username}
                    link={`${env.NEXT_PUBLIC_BASE_URL}/@${username}`}
                  />
                </div>
              ) : (
                <p>Set your username first</p>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <NavigationMenu className="hidden sm:flex">
        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  active={pathname === item.href}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
