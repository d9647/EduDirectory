
import { Link } from "wouter";

export default function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 bg-yellow-400 text-black px-3 py-1 rounded cursor-pointer">
                <img src="/logo.png" alt="Education Yellow Pages" className="h-8 w-8" />
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  Education Yellow Pages
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
