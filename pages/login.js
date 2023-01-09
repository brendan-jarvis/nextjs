import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Account from '../components/Account'

import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const Login = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <Layout login>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
          />
        ) : (
          <Account session={session} />
        )}
      </div>
    </Layout>
  )
}

export default Login
