
// tool imports from react
import { StrictMode } from 'react'; // activates extra checks and warning during dev
import { createRoot } from 'react-dom/client';// modern api for creating the root react DOM node
//importing styles
import './styles/main.scss';
//importing root app functionality for the render function below
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> /
  </StrictMode>,
);
