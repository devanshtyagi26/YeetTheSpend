"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Home, Rss, Settings, User } from "lucide-react";
import Link from "next/link";

const navigationMenuItems = [
  { title: "Home", href: "#", icon: Home },
  { title: "Charts", href: "#charts", icon: Rss },
  { title: "Account", href: "#account", icon: Settings },
  { title: "Settings", href: "#settings", icon: User },
];

export default function NavigationMenuMobile() {
  return (
    <nav className="bg-foreground flex justify-center items-center w-fit h-[100vh] p-1.5">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-col gap-[3.4rem]">
          {navigationMenuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex bg-foreground flex-col h-[4.5rem] w-[4.5rem] items-center justify-center p-1.5 rounded-full group"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 text-accent transition-colors duration-300 group-hover:text-primary mb-1.5" />
                  <span className="text-xs text-accent group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
