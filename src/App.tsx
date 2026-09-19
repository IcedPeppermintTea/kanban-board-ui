import {useState, useEffect} from "react"
import Board from "./components/Board.tsx"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"

// define the objects for the page
export type Priority = "High" | "Medium" | "Low"

export type Task = {
  id: string
  title: string
  priority: Priority
  dueDate: string
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}

export type BoardData = {
  title: string
  columns: Column[]
}

// add initial data for the objects
const initialData: BoardData = {
  title: "My Kanban Board",
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: []
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: []
    },
    {
      id: "done",
      title: "Done",
      tasks: []
    },
  ]
}

// react app function
function App() {

  const [board, setBoard] = useState<BoardData>(initialData)

  // retrieve all existing tasks 
  useEffect(() => {
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks");
      const tasksFromApi = await response.json();

      setBoard((prevBoard) => {
        const updatedColumns = prevBoard.columns.map((column) => ({
          ...column,
          tasks: tasksFromApi
            .filter((task: any) => task.column_name === column.id)
            .map((task: any) => ({
              id: String(task.id),
              title: task.title,
              priority: task.priority as Priority,
              dueDate: task.due_date,
            })),
        }));

        return { ...prevBoard, columns: updatedColumns };
      });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }

    fetchTasks();
  }, []);

  // Add a new task to a column
  function addTask(columnId: string, newTask: Task) {
    // 1. copy the current columns to change the state
    const updatedColumns: Column[] = board.columns.map(column => {
      // 2. find the right column by using the columnId
      if (column.id === columnId) {
        // 3. add the task to that column's task set while keeping existing ones
        const updatedTasks: Task[] = [...column.tasks, newTask]
        // 4. update column to have the updated task set
        const updatedColumn: Column = {...column, tasks:updatedTasks}
        // 5. return the now changed column
        return updatedColumn
      }
      // 6. if not the right column - return existing column with no changes
      return column
    })

    // 7. copy the board with the updated column set
    const updatedBoard: BoardData = {...board, columns: updatedColumns}

    // 8. update the state
    setBoard(updatedBoard)
  }

  // Delete an existing task
  function deleteTask(columnId: string, deleteTaskid: string) {
    // copy the columns
    const updatedColumns: Column[] = board.columns.map(column => {
      // if column of delete request - delete the task
      if (column.id === columnId) {
        // create new task set without the deleted task
        const newTasks: Task[] = column.tasks.filter(task => task.id !== deleteTaskid)
        // return the new set 
        return {...column, tasks: newTasks}
      }
      // otherwise return the existing column
      return column
    })

    // set the new columns
    const updateBoard: BoardData = {...board, columns: updatedColumns}
    setBoard(updateBoard)
  }

  // persist changes after dragging a task
  function onDragEnd(result: DropResult) {
    // if dragged into non-droppable position - do nothing
    if (!result.destination) {
      return
    }

    const { source, destination } = result

    // if dropped in the same spot - do nothing
    if (source.droppableId === destination.droppableId
      && source.index === destination.index) {
        return
    }
    
    // if dropped somewhere new within the same column, update task position
    if (source.droppableId === destination.droppableId) {
      // find the column of the moved task
      const column = board.columns.find(col => col.id === source.droppableId)
      if (!column) return

      // copy the tasks
      const newTasks: Task[] = [...column.tasks]

      // remove moved task from its source position
      const [movedTask] = newTasks.splice(source.index, 1)

      // place it in its new position 
      newTasks.splice(destination.index, 0, movedTask)

      // if changed column - update task set, else display column as is
      const updatedColumns: Column[] = board.columns.map(col => 
        col.id === column.id ? {...col, tasks: newTasks} : col
      )
      
      setBoard({...board, columns: updatedColumns})
    }
    // if dropped in a new column
    else {
      // find the source column of the moved task
      const sourceColumn = board.columns.find(col => col.id === source.droppableId)
      if (!sourceColumn) return

      // find destination column of the moved task
      const destColumn = board.columns.find(col => col.id === destination.droppableId)
      if (!destColumn) return

      // copy the tasks of the source column
      const sourceTasks: Task[] = [...sourceColumn.tasks]

      // copy the tasks of the destination column
      const destTasks: Task[] = [...destColumn.tasks]
      
      // remove the moved task from source
      const [movedTask] = sourceTasks.splice(source.index, 1)

      // insert moved task to destination
      destTasks.splice(destination.index, 0, movedTask)

      // if changed column - update task set, else display column as is
      const updatedColumns: Column[] = board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return {...col, tasks: sourceTasks}
        }
        if (col.id === destColumn.id) {
          return {...col, tasks: destTasks}
        }
        return col
      })
      setBoard({...board, columns: updatedColumns})
    }
  }
  
  return (
    <DragDropContext
    onDragEnd={onDragEnd}>
      <Board data={board} addTask={addTask} deleteTask={deleteTask}/> 
    </DragDropContext>
  )
}

export default App