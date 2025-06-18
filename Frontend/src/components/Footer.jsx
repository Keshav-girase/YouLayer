import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Ensure you have React Router for navigation

export default function Footer() {
  return (
    <div className="bg-background text-foreground">
      <div className="w-full border-t border-border bg-background">
        <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left - Brand Name */}

          <Link
            to="/"
            className="scroll-m-20 text-xl font-bold ml-1 tracking-tight flex items-center gap-2"
          >
            <img
              src="/YouLayerLogo2.png" // or "/YouLayerLogo2.svg"
              alt="YouLayer Logo"
              className="h-10 w-auto"
            />
            <h2 className="text-lg font-bold text-primary">You Layer</h2>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <Link to="/projects" className="hover:text-primary transition">
              Projects
            </Link>
            <Link to="/contact" className="hover:text-primary transition">
              Contact
            </Link>
          </nav>

          {/* Right - Social Media & Email */}
          <div className="flex items-center space-x-5">
            {/* Email */}
            <a href="mailto:keshavgirase007@email.com" className="relative group">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-background">
                <Mail className="w-5 h-5 " />
              </div>
            </a>

            {/* Social Links */}
            <a
              href="https://github.com/Keshav-girase"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-background">
                <Github className="w-5 h-5 " />
              </div>
            </a>
            <a
              href="https://github.com/Keshav-girase"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-background">
                <Linkedin className="w-5 h-5 " />
              </div>
            </a>
            <a
              href="https://x.com/Keshav_Girase"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-background">
                <Twitter className="w-5 h-5 " />
              </div>
            </a>
          </div>

          {/* Hire Me Button */}
          <Button
            variant="default"
            className="px-5 py-2 rounded-full shadow-md transition  bg-primary text-primary-foreground"
          >
            Hire Me
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-muted-foreground border-t border-t-border py-4 flex flex-col md:flex-row items-center justify-evenly  mx-auto px-4">
          <span className="text-center text-xs mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} YouLayer. All rights reserved.
          </span>
          <div className="flex gap-6 text-xs">
            <Link to="/docs" className="hover:underline">
              Docs
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <a href="mailto:support@youlayer.com" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
        {/* <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} YouLayer. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/docs" className="hover:underline">Docs</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <a href="mailto:support@youlayer.com" className="hover:underline">Contact</a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
