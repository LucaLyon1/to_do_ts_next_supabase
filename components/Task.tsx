import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { task } from "@/type"

function Task(task: task) {
    const supabaseClient = useSupabaseClient()

    const deleteTask = async (id: bigint) => {
        await supabaseClient.from('to-do').delete().eq('id', id)
    }

    return(
        <div className="border-black border-2 m-auto w-1/2 my-4 text-center p-4 rounded-md">
            <p onClick={() => deleteTask(task.id)} className="float-left cursor-pointer hover:text-red-600">Delete</p>
            <h1 className="text-3xl my-2">{task.name}</h1>
            <p className="my-2">{task.description}</p>
            <p className="italic my-2">{new Date(task.created_at).toLocaleDateString('en-GB')}</p>
        </div>
    )
}

export default Task