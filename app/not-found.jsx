import Link from "next/link";

export const metadata = {
  title: "Page Not Found - Ratoomal's",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FCF8F1] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-[120px] font-bold text-[#C08237]/20 leading-none playfair select-none">
          404
        </h1>
        <div className="text-6xl mb-6">??</div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] playfair mb-3">
          Page Not Found
        </h2>
        <p className="text-[#666] mona text-base mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-[#C08237] text-white rounded-lg font-medium hover:bg-[#a56e2e] transition-colors">
            Go to Home
          </Link>
          <Link href="/category" className="px-6 py-3 border border-[#C08237] text-[#C08237] rounded-lg font-medium hover:bg-[#C08237] hover:text-white transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
