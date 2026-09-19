import { type BoardData, type Task } from "../App"
import Column from "./Column"

// create the type that describes what the component will receive
type BoardProps = {
    data: BoardData
    addTask: (columnId: string, newTask:  Omit<Task, "id">) => void
    deleteTask: (columnId: string, deleteTaskId: string) => void
}

// create the component Board
function Board({data, addTask, deleteTask}: BoardProps) {
    return (
        <div className="bg-fuchsia-50 min-h-screen font-mono p-8">
            <h1 className="text-3xl font-semibold text-purple-900 mb-8">{data.title}</h1>
            <div className="grid grid-cols-3 gap-6">
                {/* map each of the columns*/}
                {data.columns.map(column => (
                    <Column key={column.id} column={column} addTask={addTask} deleteTask={deleteTask}/>
                ))}
            </div>
        </div>
    )
}

// export the component
export default Board