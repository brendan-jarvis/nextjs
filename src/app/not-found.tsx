import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center mx-auto h-screen">
      <h2 className="font-bold text-3xl text-red-500">404 - page not found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className="hover:underline visited:text-purple-500 active:text-indigo-500"
      >
        Return Home
      </Link>
    </div>
  )
}
