/**
 * Custom hook that encapsulates all task-related Supabase logic:
 *  - load tasks
 *  - add task
 *  - toggle completion
 *  - delete task
 *  - (optional) realtime updates
 */

// react imports
import { useCallback, useEffect, useState } from "react";
// supabase client
import { supabase } from "../lib/supabaseClient";

function useTasks() {
  // local state owned by the hook
  const [tasks, setTasks] = useState([]);     // list of tasks
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null);   // error message

  /**
   * Loads tasks from Supabase and stores them in state.
   * Called when a component using this hook first mounts.
   */
  //UseCallback keeps the same function reference between renders so effects and child components don't re-run unnecessarily
  const loadTasks = useCallback(async () => {
    //Async function because Supabase calls are network/fetch requests which return promises
    setLoading(true); // useCallback keeps the same function reference between renders so effects and child components don't re-run unnecessarily
    setError(null);

    const { data, error: queryError } = await supabase //supbase fetch request to select all columns from the task table and sort them by "created_at" and list them from newest to oldest.
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError("Error loading tasks: " + queryError.message);
    } else {
      setTasks(data);
    }

    setLoading(false);
  }, []);// empty dependency array means this only runs once

  /**
   * Adds a new task.
   * Supabase returns an array, so we take the first inserted row.
   */
  const addTask = useCallback(async (title) => {
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert([{ title, is_complete: false }])
      .select();

    if (insertError) {
      console.error(insertError);//logs the error msg
      throw insertError; // Throws error so calling code can handle it if needed
    }

    const inserted = data?.[0];//starts with beginning of the array
    if (inserted) {
      // prepend new task to current list
      setTasks((prev) => [inserted, ...prev]); //puts inserted tasks at the beginning of the array and then repeats the rest of it.
    }//spread operator keeps the state updates immutable.
  }, []);

  /**
   * Updates a task's completed state.
   */
  const toggleTask = useCallback(async (id, isComplete) => {
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ is_complete: isComplete })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      throw updateError;
    }

    // update local state without refetching
    setTasks((prev) =>
      prev.map((task) => //map creates a new array here
        task.id === id //tasks that match are changed
          ? { ...task, is_complete: isComplete } //to complete. and gives us back the array with the updated changes
          : task //no changes made if it doesnt match anything.
      )
    );
  }, []);

  /**
   * Deletes a task.
   */
  const deleteTask = useCallback(async (id) => {
    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      throw deleteError;
    }

    // remove task from local state
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  }, []);

  // initial load when hook is first used
 useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };

    fetchTasks();
  }, [loadTasks]);


  /**
   * Optional realtime subscription.
   * Keeps tasks in sync across tabs.
   */
  useEffect(() => {
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) => {
            if (payload.eventType === "INSERT") {
              const exists = prev.some(
                (task) => task.id === payload.new.id
              );
              if (exists) return prev;
              return [payload.new, ...prev];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((task) =>
                task.id === payload.new.id ? payload.new : task
              );
            }

            if (payload.eventType === "DELETE") {
              return prev.filter(
                (task) => task.id !== payload.old.id
              );
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask
  };
}

export { useTasks };
