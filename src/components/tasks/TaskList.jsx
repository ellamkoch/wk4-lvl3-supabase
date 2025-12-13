//supabase library import
import { supabase } from "../../lib/supabaseClient";
//react hook imports
import { useEffect, useState } from "react";

//importing other task components
import TaskItem from "./TaskItem.jsx";
import NewTaskForm from "./NewTaskForm.jsx";


/**
 * TaskList is responsible for:
 *  - Fetching tasks from Supabase on mount.
 *  - Managing loading and error state for the list.
 *  - Rendering a list of TaskItem components.
 *  - filtering the list based on all active or completed. default is to have all listed
 */
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  /**
   * Loads tasks from the Supabase "tasks" table.
   */
  const loadTasks = async () => {//loads the current tasks
    // Set loading and errors
    setLoading(true);
    setError(null); //clears any pervious error msgs

    const { data, error: queryError } = await supabase //fetches data (rows from table) from supabase
      .from('tasks') //from the tasks table by using the supabase js client to fetch
      .select('*') //selects all columns in the task table
      .order("created_at", { ascending: false }); // and orders them by newest based on the created_at property

    //what happens if a queryError is received.
    if (queryError) {  //changes the error to a queryError msg
      setError('Error loading tasks: ' + queryError.message); //and shows it so it doesn't conflict with the error below.
    } else { //if no error, it updates the task list
      setTasks(data);
    }
    setLoading(false); //sets loading state to false
  };

  /**
   * Adds a new task by inserting it into Supabase and updating local state.
   *
   * @param {string} title - Title of the new task.
   */
  const handleAddTask = async (title) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title }]) //inserts a new row into supabase with the title
      .select(); //makes supabase return the inserted row so it can be used immediately.

    if (error) { //taskList throws the error, NewTaskForm tries to try/ catch it so it can show the msg.
      // Re-throw so NewTaskForm can display the error.
      throw error;
    }

    const insertedTask = data?.[0]; // updates the react state by creating a new array
    if (insertedTask) {
      // Prepend the new task to the existing list and react re-renders and runs the visibleTasks.map, which
      setTasks((prev) => [insertedTask, ...prev]); //makes it so that nothing must be refetched or reloaded to add the new task.
    } //  ...prev spreads the previous tasks into a new array so the array isn't mutated and code is cleaner/faster
  };//information is only updated with the insertion task.

  /**
   * Toggles the is_complete flag of a task both in Supabase and local state.
   *
   * @param {number} id - Task ID.
   * @param {boolean} isComplete - Desired completion state.
   */
  const handleToggleComplete = async (id, isComplete) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_complete: isComplete })
      .eq("id", id);

    if (error) { //console logs the error and provides an alert that the task failed to update on the screen
      console.error(error);
      alert("Failed to update task.");
      return;
    }
    //updates the array in an immutable pattern
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, is_complete: isComplete } : task //returns a new object for the matching task, while leaving the others unchanged
      )
    );
  };

  /**
   * Deletes a task by id from Supabase and local state.
   *
   * @param {number} id - Task ID.
   */
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm("Delete this task?");//asks the user to confirm the deletion in a window on the pg.
    if (!confirmDelete) return;

    const { error } = await supabase.from("tasks").delete().eq("id", id); // deletes the task row from Supabase where id matches

    if (error) { //returns msg why it couldnt delete in console and the alert msg below.
      console.error(error);
      alert("Failed to delete task.");
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };

    fetchTasks();
  }, []);

  // Derived summary information based on current tasks.
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.is_complete).length;

  // Derived filtered list based on current filter state.
  const visibleTasks = tasks.filter((task) => { //filters the visible tasks
    if (filter === "active") return !task.is_complete; //returns items not equal to a task being completed
    if (filter === "completed") return task.is_complete; //returns tasks that are completed only
    return true;
  });

  return ( //returns the form, calling on supabase,
    // inserts the filter controls
    //states whether tasks are loading, or if there's an error.
    //also lists msg no tasks yet if there are no tasks, no error message, and no loading state
    // in {totalTasks} if its greater than 0, it lists a summary of the tasks in the list and completed ones are counted in summary form
    // rendering visible tasks in the list area below in the order in which tasks are created_at in the table.
    // <NewTaskForm onAddTask={handleAddTask} /> NewTask is a component that receives directions from the prop onAddTask function
    <section className="card">
      <h2>Tasks</h2>

      <NewTaskForm onAddTask={handleAddTask} />

      {/* Filter controls */}
      <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
        <span style={{ marginRight: "0.5rem" }}>Filter:</span>
        <button
          type="button"
          onClick={() => setFilter("all")}
          style={{
            marginRight: "0.25rem",
            fontWeight: filter === "all" ? "600" : "400"
          }}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          style={{
            marginRight: "0.25rem",
            fontWeight: filter === "active" ? "600" : "400"
          }}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          style={{
            fontWeight: filter === "completed" ? "600" : "400"
          }}
        >
          Completed
        </button>
      </div>

      {loading && <p>Loading tasks…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && tasks.length === 0 && <p>No tasks yet.</p>}

      {totalTasks > 0 && (
        <p className="task-summary">
          <strong>{totalTasks}</strong> tasks ·{" "}
          <strong>{completedTasks}</strong> completed
        </p>
      )}

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
    </section>
  );
};

export default TaskList;

// CRUD - Create, Read, Update and Delete
