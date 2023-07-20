import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/utils/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

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

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <NavigationMenu>
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
    // <nav
    //   className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    //   {...props}
    // >
    //   {items.map((item) => (
    //     <Link
    //       key={item.title}
    //       href={item.href}
    //       className={cn(
    //         "text-sm font-medium transition-colors hover:text-primary",
    //         pathname !== item.href && "text-muted-foreground"
    //       )}
    //     >
    //       {item.title}
    //     </Link>
    //   ))}
    // </nav>
  );
}
