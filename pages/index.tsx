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
    label: 'House',
  })
  
  useEffect(() => {
    async function loadData(){
      const { data } = await supabaseClient.from('to-do').select('*')
      setTasks(data as task[])
    }
    loadData()
    console.log('fast as fuck boiii')
  }, [])

  useEffect(() => {
    const channel = supabaseClient.channel('realtime tasks').on('postgres_changes', {
      event:'INSERT',
      schema:'public',
      tables:'to-do',
    }, (payload) => {
      setTasks([...tasks ?? [], payload.new as task])
    }).subscribe()

    const channelDel = supabaseClient.channel('delete tasks').on('postgres_changes', {
      event:'DELETE',
      schema:'public',
      tables:'to-do',
    }, (payload) => {
      if(tasks) {
        let newTasks: task[]= [...tasks]
        newTasks.splice(tasks.indexOf(tasks.find(t => t.id === payload.old.id) || tasks[-1]),1)
        setTasks(newTasks)
      }
    }).subscribe()


    return () => {
      supabaseClient.removeChannel(channel)
      supabaseClient.removeChannel(channelDel)
    }
  }, [supabaseClient, tasks, setTasks])



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
      })
    }
  }
  return(
    <div>
    {tasks && tasks.map((task, i: React.Key) => 
      <Task {...task} key={i}/>
    )}
    <form action="" className="flex flex-col gap-4 w-1/4 m-auto mt-8">
      <input className="bg-white border-black border-2 h-12 focus:border-green-400 focus:outline-none p-4 rounded-md" onChange={handleChange} type="text" name="name" id="name" value={values.name} />
      <textarea className="bg-white border-black border-2 focus:border-green-400 focus:outline-none p-4 rounded-md" onChange={handleChange} name="description" id="desc" cols={30} rows={10} value={values.description} ></textarea>
      <select className="bg-white border-black border-2 h-12 focus:border-green-400 focus:outline-none px-4 rounded-md" onChange={handleChange} name="label" id="label">
        <option value="House">House</option>
        <option value="Work">Work</option>
        <option value="Sport">Sport</option>
      </select>
      <button className="bg-white border-black border-2 hover:border-green-400 rounded-md" onClick={addTask}>Add Task</button>
    </form>
    </div>
  )
}
