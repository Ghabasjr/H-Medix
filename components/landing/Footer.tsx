'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-xl mb-4">H-Medix Pay</h3>
            <p className="text-background/70 text-sm">
              QR-based cashless payment system for H-Medix Pharmacy and Supermarket, Abuja.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-background/70 hover:text-background transition">Features</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Pricing</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">API</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-background/70 hover:text-background transition">About</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Blog</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Careers</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-background/70 hover:text-background transition">Documentation</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Guides</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Community</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-background/70 hover:text-background transition">Privacy</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Terms</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Cookies</Link></li>
              <li><Link href="#" className="text-background/70 hover:text-background transition">Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">
            © 2026 H-Medix Pharmacy & Supermarket, Abuja. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            <Link href="#" className="text-background/70 hover:text-background transition text-sm">
              Twitter
            </Link>
            <Link href="#" className="text-background/70 hover:text-background transition text-sm">
              LinkedIn
            </Link>
            <Link href="#" className="text-background/70 hover:text-background transition text-sm">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
