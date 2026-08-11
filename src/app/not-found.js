import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#05070d] relative overflow-hidden px-6">

      {/* Background glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]" />

      {/* Glass Container */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-12 flex flex-col items-center text-gray-300">
        
        {/* 404 Heading */}
        <h1 className="text-8xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
          404
        </h1>

        {/* Message */}
        <p className="text-lg mt-4 text-gray-400 max-w-sm text-center">
          The page you are looking for might be missing or unavailable.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="mt-8 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg transition-all duration-300 backdrop-blur-md"
        >
          Return Home
        </Link>

        {/* Accent Line */}
        <div className="mt-8 w-20 h-[2px] bg-gray-500/40 rounded-full" />

      </div>
    </div>
  );
}
