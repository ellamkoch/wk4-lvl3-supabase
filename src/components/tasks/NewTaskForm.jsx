
//react import
import { useState } from "react";

/**
 * NewTaskForm lets the user add a new task.
 *
 * @param {object} props
 * @param {(title: string) => Promise<void> | void} props.onAddTask
 *        Callback invoked when the form is submitted with a non-empty title.
 */
const NewTaskForm = ({ onAddTask }) => { //destructuring the prop for the component here.
  //setting default use state variables for the component
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  //function to handle the form submit + validation, then calls parent callback
  const handleSubmit = async (event) => {
    event.preventDefault();//prevents the page refresh

    const trimmed = title.trim();//sets a variable to store the trimmed title and trims the title of any extra space
    //trimming off xtra space is important as it helps cut down on how much is being sent to/from the api,
    // which can equal credits for a plan or bytes.

    if (!trimmed) {
      setError("Task title cannot be empty.");//returns this msg if title is empty
      return;
    }

    if (trimmed.length > 80) { //returns this msg if title length is greater than 80 characters
      setError("Task title cannot exceed 80 characters.");
      return;
    }
    //preparing for submit here
    setError(null); //clears old errors
    setSubmitting(true); //signals loading state to the UI

    //calling the parent function
    try {
      await onAddTask(trimmed);//await allows async database calls
      setTitle('');//clears the input after a task has been successfully added
    } catch (formError) {
      console.log(formError);//console logs the error msg and puts error msg on the screen with msg below.
      setError("Failed to add a task. Error message: " + formError?.message);//?.message is optional chaining which helps prevent crashes if error is undefined.

      //automatically clears the error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
      //this always runs and prevents stuck loading states, even if added task fails
    } finally {
      setSubmitting(false);
    }
  };
//below is what's returned on submit of the added task, error text and what happens to the button while a task is being added. 
//htmlFor is a react rule for screen reader accessibility
//disabled in the input submit prevents double posting. Input value there comes from the state, not the DOM as its occurring on the onChange event.
//submit button is disabled if submitting or the input is empty after trimming. text updates based upon state of adding or add with ternary operator.
//{error &&} line is conditional rendering and only shows when the error exists.
  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <label htmlFor="task-title" className="sr-only">
        Task title
      </label>

      <input
        id="task-title"
        type="text"
        placeholder="Add a new task…"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={submitting}
      />

      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "Adding…" : "Add"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default NewTaskForm;
