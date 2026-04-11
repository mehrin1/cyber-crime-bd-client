/* eslint-disable @next/next/no-img-element */
"use client";

import { Menu, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}


const Navbar = ({



  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Cyber Crime BD",
  },
  menu = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Types of Cyber Crimes",
      url: "/learn",
    },
    {
      title: "Professional Advice",
      url: "/professionals",
    },
    {
      title: "Seek Help",
      url: "/help",
    },

    {
      title: "Laws",
      url: "/laws",
    },

    {
      title: "About",
      url: "/about",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: Navbar1Props) => {

  //   const { user } = useAuth() as { user: UserSchema | null };
  // const { user } = useAuth() as { user: { role?: string } } ;

  // if (isLoading) {
  //   console.log("loading");
  // }
  // const totalItems = useCartStore((state) => state.totalItems);



  return (
    <section className={cn("py-4 ", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {/* --- Cart Icon Desktop --- */}
            {/* <CartDrawer> */}
            {/* <Link href="/cart">
              <Button variant="outline" className="relative">
                Subscribe
              </Button>
            </Link> */}
            {/* </CartDrawer> */}



            {/* {
              user ? <SignOutButton /> :
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                  </Button>
                </>
            } */}

            <Button variant="outline" size="sm">
              <Link href={auth.login.url}>{auth.login.title}</Link>
            </Button>
            <Button size="sm">
              <Link href={auth.signup.url}>{auth.signup.title}</Link>
            </Button>


          </div>
        </nav>








        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
            </Link>

            <div className="flex items-center gap-2">
              {/* --- Cart Icon Mobile --- */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative mr-2">
                  checking
                </Button>
              </Link>


              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="icon">
                      <Menu className="size-4" />
                    </Button>
                  }
                />
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion className="flex w-full flex-col gap-4">
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {/* {!user && (
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </div>
                    )}
                    {user && <SignOutButton />} */}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        render={
          <Link
            href={item.url}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
          >
            {item.title}
          </Link>
        }
      />
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar };