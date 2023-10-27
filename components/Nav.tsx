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
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
        <HomeButton />
        <BlogButton />
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
  )
}
