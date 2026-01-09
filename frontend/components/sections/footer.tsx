import { Mail } from "lucide-react";
import { RiTwitterXLine, RiLinkedinLine } from "@remixicon/react";
import Link from "next/link";
import Logo from "../ui/logo";
const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#api" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "Community", href: "#community" },
    { label: "Templates", href: "#templates" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "Disclaimer", href: "#disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-surface-border">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href={"/"} className="mb-4">
              <Logo />
            </Link>
            <p className="text-text-secondary mb-6 max-w-sm">
              The self-service newsletter advertising platform that connects
              creators with sponsors.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <RiTwitterXLine className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <RiLinkedinLine className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-surface-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              © 2024 Adsloty. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-text-secondary text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Status
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Changelog
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
