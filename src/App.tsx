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
  async function addTask(columnId: string, newTaskData: Omit<Task, "id">) {
  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTaskData.title,
        priority: newTaskData.priority,
        due_date: newTaskData.dueDate,
        column_name: columnId,
      }),
    });

    const createdTask = await response.json();

    const newTask: Task = {
      id: String(createdTask.id),
      title: createdTask.title,
      priority: createdTask.priority as Priority,
      dueDate: createdTask.due_date,
    };

    const updatedColumns: Column[] = board.columns.map((column) => {
      if (column.id === columnId) {
        const updatedTasks: Task[] = [...column.tasks, newTask];
        return { ...column, tasks: updatedTasks };
      }
      return column;
    });

    setBoard({ ...board, columns: updatedColumns });
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

  // Delete an existing task
  async function deleteTask(columnId: string, deleteTaskId: string) {
  try {
    await fetch(`http://localhost:3000/tasks/${deleteTaskId}`, {
      method: "DELETE",
    });

    const updatedColumns: Column[] = board.columns.map((column) => {
      if (column.id === columnId) {
        const newTasks: Task[] = column.tasks.filter(
          (task) => task.id !== deleteTaskId
        );
        return { ...column, tasks: newTasks };
      }
      return column;
    });

    const updatedBoard: BoardData = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
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
      const sourceColumn = board.columns.find(col => col.id === source.droppableId)
      if (!sourceColumn) return

      const destColumn = board.columns.find(col => col.id === destination.droppableId)
      if (!destColumn) return

      const sourceTasks: Task[] = [...sourceColumn.tasks]
      const destTasks: Task[] = [...destColumn.tasks]

      const [movedTask] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, movedTask)

      const updatedColumns: Column[] = board.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return {...col, tasks: sourceTasks}
        }
        if (col.id === destColumn.id) {
          return {...col, tasks: destTasks}
        }
        return col
      })

      // update UI immediately
      setBoard({...board, columns: updatedColumns})

      // persist the column change to the database
      fetch(`http://localhost:3000/tasks/${movedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ column_name: destColumn.id }),
      }).catch((err) => {
        console.error("Failed to update task column:", err)
      })
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