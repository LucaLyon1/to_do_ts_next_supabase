import Task from "@/components/Task"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useEffect, useState } from 'react'

export interface task {
  id: bigint,
  created_at: string,
  name: string,
  description: string,
  label: Int8Array,
}

export default function Home() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [tasks, setTasks] = useState<task[]>()
  
  useEffect(() => {
    async function loadData(){
      const { data } = await supabaseClient.from('to-do').select('*')
      setTasks(data as task[])
      console.log(data[0])
    }
    if(user) loadData()
  }, [user])

  if(!user) {
    return (
      <div>You must be logged in to view your tasks</div>
    )
  }

  return(
    <div>{tasks && tasks.map((task, i: React.Key) => 
      <Task {...task} key={i}/>
    )}
    </div>
  )
}
