import { useState } from "react"
import { type Priority, type Task} from "../App"

// create the type that describes what the component will receive
type addTaskProp = {
    columnId: string
    addTask: (columnId: string, newTask: Omit<Task, "id">) => void
    onClose: () => void
}


// create the component Task Form
function AddTaskForm({columnId, addTask, onClose}: addTaskProp) {
    const [title, setTitle] = useState<string>("")
    const [priority, setPriority] = useState<Priority>("Medium")
    const [dueDate, setDueDate] = useState<string>("")

    async function handleSubmit() {
        const newTask: Omit<Task, "id"> = { title, priority, dueDate }

        await addTask(columnId, newTask)

        setTitle("")
        setPriority("Medium")
        setDueDate("")

        onClose()
    }

    return (
        <div className="bg-white border border-purple-200 rounded-lg p-3 flex flex-col gap-3">
            {/* title */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-purple-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm border border-purple-200 rounded-md px-2 py-1.5 text-purple-900 outline-none focus:ring-2 focus:ring-purple-300"
                />
            </div>
             {/* priority */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-purple-700">Priority</label>
                <select
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="text-sm border border-purple-200 rounded-md px-2 py-1.5 text-purple-900 outline-none focus:ring-2 focus:ring-purple-300"
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            {/* due date */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-purple-700">Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-sm border border-purple-200 rounded-md px-2 py-1.5 text-purple-900 outline-none focus:ring-2 focus:ring-purple-300"
                />
            </div>
            {/* buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-1.5 rounded-md transition-colors"
                >
                    Add Task
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 border border-purple-200 text-purple-400 hover:bg-purple-50 text-sm py-1.5 rounded-md transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default AddTaskForm