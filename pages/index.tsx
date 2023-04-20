import Task from "@/components/Task"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { ChangeEvent, useEffect, useState } from 'react'

import { task } from "@/type"

export default function Home() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [tasks, setTasks] = useState<task[]>()
  const [values, setValues] = useState<task>({
    id: BigInt(1),
    created_at: '',
    name: '',
    description: '',
    label: '',
    uid: ''
  })
  
  useEffect(() => {
    async function loadData(){
      const { data } = await supabaseClient.from('to-do').select('*').eq('uid', user?.id)
      setTasks(data as task[])
    }
    if(user) loadData()
  }, [user])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>) => {
    setValues({...values, [e.currentTarget.name]:e.currentTarget.value})
  }

  const addTask = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    if(user) {
      await supabaseClient.from('to-do').insert({
        name:values.name,
        description:values.description,
        label:values.label,
        uid:user.id
      })
    }
  }

  if(!user) {
    return (
      <div>You must be logged in to view your tasks</div>
    )
  }

  return(
    <div>
    <form action="" className="flex flex-col gap-4 w-1/4 m-auto mt-24">
      <input className="bg-white border-black border-2 h-12 focus:border-green-400 focus:outline-none p-4 rounded-md" onChange={handleChange} type="text" name="name" id="name" value={values.name} />
      <textarea className="bg-white border-black border-2 focus:border-green-400 focus:outline-none p-4 rounded-md" onChange={handleChange} name="description" id="desc" cols={30} rows={10} value={values.description} ></textarea>
      <select className="bg-white border-black border-2 h-12 focus:border-green-400 focus:outline-none px-4 rounded-md" onChange={handleChange} name="label" id="label">
        <option value="House">House</option>
        <option value="Work">Work</option>
        <option value="Sport">Sport</option>
      </select>
      <button className="bg-white border-black border-2 hover:border-green-400 rounded-md" onClick={addTask}>Add Task</button>
    </form>
    {tasks && tasks.map((task, i: React.Key) => 
      <Task {...task} key={i}/>
    )}
    </div>
  )
}
