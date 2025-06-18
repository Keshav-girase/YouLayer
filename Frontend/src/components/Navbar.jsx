import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';

const Navbar = () => {
  return (
    <nav className="w-full backdrop-opacity-10 border-b backdrop-blur-sm bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between p-2">
        {/* Logo */}
        <div className="flex items-center justify-between gap-6">
          <Link
            to="/"
            className="scroll-m-20 text-xl font-bold ml-1 tracking-tight flex items-center gap-2"
          >
            <img
              src="/YouLayerLogo2.png" // or "/YouLayerLogo2.svg"
              alt="YouLayer Logo"
              className="h-10 w-auto"
            />
            You Layer
          </Link>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-4 text-muted-foreground ">
              <NavigationMenuItem>
                <NavLink to="/" className="hover:text-foreground">
                  Home
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink to="/#features" className="hover:text-foreground">
                  Feature
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/creator/dashboard"
                  className={({ isActive }) =>
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  Creator
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink
                  to="/manager/dashboard"
                  className={({ isActive }) =>
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  Manager
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Theme Toggle and Mobile Menu */}
        <div className="flex justify-evenly items-center gap-2">
          <div className="md:flex md:justify-end">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Drawer>
            <DrawerTrigger>
              <Button className="md:hidden " variant="outline">
                <Menu size={24} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col gap-4 justify-start items-start ml-8 text-base text-muted-foreground">
                  <NavigationMenuItem>
                    <DrawerClose asChild>
                      <NavLink to="/" className="hover:text-foreground">
                        Home
                      </NavLink>
                    </DrawerClose>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <DrawerClose asChild>
                      <NavLink to="/#features" className="hover:text-foreground">
                        Feature
                      </NavLink>
                    </DrawerClose>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="ml-1">
                    <DrawerClose asChild>
                      <NavLink to="/" className="hover:text-foreground">
                        Home
                      </NavLink>
                    </DrawerClose>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <DrawerClose asChild>
                      <NavLink to="/creator/dashboard" className="hover:text-foreground">
                        Creator
                      </NavLink>
                    </DrawerClose>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <DrawerClose asChild>
                      <NavLink to="/manager/dashboard" className="hover:text-foreground">
                        Manager
                      </NavLink>
                    </DrawerClose>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <DrawerFooter className="flex justify-center items-center">
                <DrawerDescription className="text-base">YouLayer</DrawerDescription>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
