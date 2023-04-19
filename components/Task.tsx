
export interface task {
    id: bigint,
    created_at: string,
    name: string,
    description: string,
    label: Int8Array,
  }

function Task(task: task) {

    const deleteTask = (id: bigint) => {
        alert(id)
    }

    return(
        <div className="border-white border-2 m-auto w-1/2 my-4 text-center">
            <p onClick={() => deleteTask(task.id)} className="float-left cursor-pointer hover:text-red-700">Delete</p>
            <h1 className="text-3xl my-2">{task.name}</h1>
            <p className="my-2">{task.description}</p>
            <p className="italic my-2">{new Date(task.created_at).toLocaleDateString('en-GB')}</p>
        </div>
    )
}

export default Task