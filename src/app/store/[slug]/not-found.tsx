import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="text-6xl mb-4">🏪</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Store Not Found
      </h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        The store you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
