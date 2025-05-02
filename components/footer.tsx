import Link from "next/link"
import { Anchor, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Anchor className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">Breeze Marine</span>
            </div>
            <p className="mb-4 text-gray-400">
              Professional boat services, sales, and trailer rentals in Long Beach, California.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-cyan-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/boats" className="text-gray-400 hover:text-cyan-400">
                  Boats for Sale
                </Link>
              </li>
              <li>
                <Link href="/trailers" className="text-gray-400 hover:text-cyan-400">
                  Trailer Rentals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-cyan-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/engine-maintenance" className="text-gray-400 hover:text-cyan-400">
                  Engine Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services/hull-repairs" className="text-gray-400 hover:text-cyan-400">
                  Hull Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/detailing" className="text-gray-400 hover:text-cyan-400">
                  Detailing
                </Link>
              </li>
              <li>
                <Link href="/services/winterization" className="text-gray-400 hover:text-cyan-400">
                  Winterization
                </Link>
              </li>
              <li>
                <Link href="/services/diagnostics" className="text-gray-400 hover:text-cyan-400">
                  Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-400 mt-0.5" />
                <span className="text-gray-400">
                  123 Marina Way
                  <br />
                  Long Beach, CA 90803
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cyan-400" />
                <a href="tel:+15625551234" className="text-gray-400 hover:text-cyan-400">
                  (562) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <a href="mailto:info@breezemarineservice.com" className="text-gray-400 hover:text-cyan-400">
                  info@breezemarineservice.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Breeze Marine Boat Service LLC. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-cyan-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cyan-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
