import { createClient } from '@/utils/supabase/server'
import AuthButton from './AuthButton'
import BlogButton from './BlogButton'
import HomeButton from './HomeButton'

export const dynamic = 'force-dynamic'

const canInitSupabaseClient = () => {
  try {
    createClient()
    return true
  } catch (e) {
    return false
  }
}

export default function Nav() {
  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <HomeButton />
        <BlogButton />
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
  )
}
