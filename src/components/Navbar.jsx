"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChartSpline, NotebookPen, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navigationMenuItems = [
  { title: "Add", href: "/", icon: NotebookPen },
  { title: "Charts", href: "/charts", icon: ChartSpline },
  { title: "Account", href: "/account", icon: Settings },
  { title: "Settings", href: "/settings", icon: User },
];

export default function NavigationMenuMobile() {
  const [activeIndex, setActiveIndex] = useState(0); // default is 0

  useEffect(() => {
    const savedIndex = localStorage.getItem("activeIndex");
    if (savedIndex !== null) {
      setActiveIndex(JSON.parse(savedIndex));
    }
  }, []);

  useEffect(() => {
    // Save the active index to localStorage whenever it changes
    localStorage.setItem("activeIndex", JSON.stringify(activeIndex));
  }, [activeIndex]);

  const handleLinkClick = (index) => {
    setActiveIndex(index); // Update active item on click
  };

  return (
    <nav className="bg-foreground p-1.5 z-50 fixed bottom-0 left-0 w-full md:w-auto md:left-0 md:top-0 md:h-screen flex justify-center items-center md:static">
      <NavigationMenu>
        <NavigationMenuList
          className={cn(
            "flex md:flex-col justify-between md:gap-[3.4rem] gap-[2.5rem] w-full md:w-fit md:px-4 md:py-2"
          )}
        >
          {navigationMenuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link href={item.href} onClick={() => handleLinkClick(index)}>
                  <div
                    id={`link-${index}`}
                    className={cn(
                      "group flex flex-col items-center justify-center relative md:scale-100 scale-120"
                    )}
                  >
                    {/* Adjust icon size on mobile */}
                    <item.icon
                      className={cn(
                        "transition-all duration-300 mb-1.5",
                        activeIndex === index
                          ? "text-primary scale-110" // Active state: Make the icon larger
                          : "group-hover:text-primary group-hover:scale-110",
                        "h-8 w-8 text-accent size-[1.2rem] sm:h-10 sm:w-10 md:h-6 md:w-6" // Larger size on mobile and small screens
                      )}
                    />
                    {/* Hide text on mobile */}
                    <span
                      className={cn(
                        "text-sm transition-all duration-300",
                        activeIndex === index
                          ? "font-semibold text-primary" // Active state: Bold text and change color
                          : "group-hover:text-primary",
                        "hidden md:block" // Hide on mobile and show on medium+ screens
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
