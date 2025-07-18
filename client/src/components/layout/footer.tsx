import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-500">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="text-xs text-gray-400 hover:text-gray-500">
            Terms of Service
          </Link>
        </div>
        <div className="mt-4 md:mt-0 md:order-1">
          <p className="text-center text-xs text-gray-400">
            &copy; 2025 Education Yellow Pages | Dragonfly AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}