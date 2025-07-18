
import { Link } from "wouter";

export default function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/logo_header.png" alt="Education Yellow Pages" className="h-12 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
