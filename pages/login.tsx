import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { useEffect, useState } from "react";
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { task } from "@/type";

export default function login () {
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const [data, setData] = useState<task[]>()

    useEffect(() => {
        async function loadData() {
          const { data }= await supabaseClient.from('to-do').select('*')
          setData(data as task[])
        }
        // Only run query once user is logged in.
        if (user) loadData()
      }, [user])
    
      if (!user)
        return (
          <Auth
            redirectTo="http://localhost:3000/"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google', 'github']}
            socialLayout="horizontal"
          />
        )
    
      return (
        <>
          <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
          <p>user:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <p>client-side data fetching with RLS</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )
}