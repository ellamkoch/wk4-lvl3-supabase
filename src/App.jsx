import MainLayout from "./components/layout/MainLayout.jsx";
import TaskList from "./components/tasks/TaskList.jsx";

/**
 * Root App component.
 * Renders the TaskList inside the shared MainLayout component
 */
export default function App() {
  return (
    <MainLayout>
      <TaskList />
    </MainLayout>
  );
}
