import Link from "next/link";
import { usePathname } from "next/navigation";

import useNavbarStore from "~/store/navbar";
import { cn } from "~/utils/utils";
import DialogQrCode from "../dialog-qrcode";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Separator } from "../ui/separator";

interface MainNav {
  href: string;
  title: string;
}

const items: MainNav[] = [
  {
    href: "/confessions",
    title: "Confessions",
  },
  // {
  //   href: "/questions",
  //   title: "Questions",
  // },
];

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
          "light:bg-white absolute -left-8 top-[89px] z-20 w-full flex-col space-y-2 bg-background px-8 py-6 shadow-md transition-all duration-150 ease-in-out sm:hidden",
          isMenuOpen ? "flex" : "hidden"
        )}
      >
        {items.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={
              pathname === item.href
                ? "light:bg-slate-100 dark:bg-slate-700"
                : ""
            }
            asChild
          >
            <Link href={item.href} onClick={toggleMenu}>
              {item.title}
            </Link>
          </Button>
        ))}
        <Separator />
        <DialogQrCode size={{ width: 300, height: 300 }} username={username}>
          <Button>Share link</Button>
        </DialogQrCode>
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
