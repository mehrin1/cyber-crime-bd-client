/* eslint-disable @next/next/no-img-element */
"use client";

import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

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
      title: "Research & Surveys",
      url: "/research",
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
      title: "Community",
      url: "/community",
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
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const callbackURL =
    pathname === "/login" || pathname === "/register" ? "/" : pathname;
  const loginURL = `${auth.login.url}?callbackURL=${encodeURIComponent(callbackURL)}`;
  const registrationURL = `${auth.signup.url}?callbackURL=${encodeURIComponent(callbackURL)}`;
  const user = session?.user;

  async function handleSignOut() {
    setIsSigningOut(true);

    const result = await authClient.signOut();

    if (!result.error) {
      router.push("/");
      router.refresh();
    }

    setIsSigningOut(false);
  }

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
            {!isPending && user ? (
              <>
                <span
                  className="flex items-center px-2 text-sm font-medium"
                  aria-label="Signed in user"
                >
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/dashboard" />}
                >
                  <LayoutDashboard />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                >
                  <LogOut />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : !isPending ? (
              <>
                <Button variant="outline" size="sm">
                  <Link href={loginURL}>{auth.login.title}</Link>
                </Button>
                <Button size="sm">
                  <Link href={registrationURL}>{auth.signup.title}</Link>
                </Button>
              </>
            ) : null}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
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
                        <img
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion className="flex w-full flex-col gap-4">
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    {!isPending && user ? (
                      <div className="flex flex-col gap-3 border-t pt-4">
                        <p className="text-sm font-medium">
                          Signed in as {user.name}
                        </p>
                        <Button
                          variant="outline"
                          render={<Link href="/dashboard" />}
                        >
                          <LayoutDashboard />
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          disabled={isSigningOut}
                          onClick={handleSignOut}
                        >
                          <LogOut />
                          {isSigningOut ? "Signing out..." : "Sign out"}
                        </Button>
                      </div>
                    ) : !isPending ? (
                      <div className="flex flex-col gap-3 border-t pt-4">
                        <Button variant="outline">
                          <Link href={loginURL}>{auth.login.title}</Link>
                        </Button>
                        <Button>
                          <Link href={registrationURL}>
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </div>
                    ) : null}
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
