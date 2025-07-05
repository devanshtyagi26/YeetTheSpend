import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Rss, Settings, User } from "lucide-react";
import Link from "next/link";

const navigationMenuItems = [
  { title: "Home", href: "#", icon: Home, isActive: true },
  { title: "Charts", href: "#blog", icon: Rss },
  // { title: "Docs", href: "#docs", icon: BookOpen },
  { title: "Account", href: "#account", icon: Settings },
  { title: "Settings", href: "#settings", icon: User },
];

export default function NavigationMenuMobile() {
  return (
    <nav className="border-2 rounded-full flex justify-center items-center w-fit p-1.5">
      <NavigationMenu>
        <NavigationMenuList>
          {navigationMenuItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex flex-col h-[4.5rem] w-[4.5rem] items-center p-1.5 rounded-full"
                )}
                active={item.isActive}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mb-1.5 h-5 w-5" />
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
