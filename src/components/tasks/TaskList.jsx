//supabase client import - preconfigured database client
import { supabase } from "../../lib/supabaseClient";

//importing react hooks
import { useEffect, useState } from "react";

//importing task item function
import TaskItem from "./TaskItem.jsx";

/**
 * TaskList is responsible for:
 *  - Fetching tasks from Supabase on mount.
 *  - Managing loading and error state for the list.
 *  - Rendering a list of TaskItem components.
 */
function TaskList() {

  //These are the basic states we'll need for this, and are needed for a state setup
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads tasks from the Supabase "tasks" table.
   */
  const loadTasks = async () => {
    // Set loading and errors
    setLoading(true);//sets loading as true so the UI can show "loading tasks"
    setError(null); //sets error as false

    //destructuring here goes through the object and returns and renames errors so they
    // don't conflict w/ the error state variable, if an error occurs.
    const { data, error: queryError } = await supabase
      .from('tasks')// chooses the tasks table in supabase
      .select('*') //selects all columns
      .order("created_at", { ascending: false }); //goes to newest task first

    if (queryError) { //error message returned if an error is found
      setError('Error loading tasks: ' + queryError.message);
    } else {
      setTasks(data); //loads tasks into state if there are no errors
    }
    setLoading(false); //ui stops showing "loading" here.
  };

  useEffect(() => { //event listener react function that fetches on the first render
    //here we're defining the inner fetchtask function
    const fetchTasks = async () => {
      await loadTasks();
    };
    //then we call it and it builds an empty array
    fetchTasks();
  }, []);

//renders the card for the loading tasks. it can return 4 different things.
// loading message
//It can load the tasks and then list them,
// provide an error msg if they dont load,
// and return a message if there are no tasks.
  return (
    <section className="card">
      <h2>Tasks</h2>

      {loading && <p>Loading tasks…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && tasks.length === 0 && <p>No tasks yet.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </section>
  ); //react uses the key to track each item in the list, which is the task id in this case.
};

export default TaskList;

// CRUD - Create, Read, Update and Delete
