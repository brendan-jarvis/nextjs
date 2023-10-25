import Link from 'next/link'

export default function BlogButton() {
  return (
    <Link
      className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
      href="/blog"
    >
      Blog
    </Link>
  )
}
