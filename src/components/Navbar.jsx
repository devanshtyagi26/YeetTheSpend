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
import { useState } from "react";
const navigationMenuItems = [
  { title: "Home", href: "/", icon: Home },
  { title: "Charts", href: "/charts", icon: Rss },
  { title: "Account", href: "/account", icon: Settings },
  { title: "Settings", href: "/settings", icon: User },
];

export default function NavigationMenuMobile() {
  const [activeIndex, setActiveIndex] = useState(0); // Track active menu item index

  const handleLinkClick = (index) => {
    setActiveIndex(index); // Update active item on click
  };

  return (
    <nav className="bg-foreground flex justify-center items-center w-fit h-[100vh] p-1.5">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-col gap-[3.4rem]">
          {navigationMenuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link href={item.href} onClick={() => handleLinkClick(index)}>
                  <div
                    id={`link-${index}`}
                    className={cn(
                      "group flex flex-col items-center justify-center relative"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6 text-accent size-[1.2rem] transition-all duration-300 mb-1.5",
                        activeIndex === index
                          ? "text-primary scale-110" // Active state: Make the icon larger
                          : "group-hover:text-primary group-hover:scale-110"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm transition-all duration-300",
                        activeIndex === index
                          ? "font-semibold text-primary" // Active state: Bold text and change color
                          : "group-hover:text-primary"
                      )}
                    >
                      {item.title}
                    </span>
                    {activeIndex === index && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-all duration-300 scale-x-100" />
                    )}
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
