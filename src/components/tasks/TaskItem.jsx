/**
 * Displays a single task as a list item.
 *
 * @param {object} props
 * @param {{ id: number, title: string, is_complete: boolean }} props.task
 */
export default function TaskItem({ task }) { //defines our component
  //returns 1 task item in a list and marks it complete or not.
  //within the span is conditional formatting. It tells react that if the task is complete,
  // apply the title and that its done styles. Uses normal title style otherwise.
  return (
    <li className="task-item">
      <span
        className={task.is_complete ? "task-item__title task-item__title--done" : "task-item__title"}
      >
        {task.title}
      </span>
    </li>
  ); //this is the read part of CRUD currently.
}
