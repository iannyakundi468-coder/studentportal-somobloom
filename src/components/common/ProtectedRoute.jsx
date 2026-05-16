import { Navigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';

export default function ProtectedRoute({ children }) {
  const { currentStudent } = useStudent();
  
  // If no student is logged in, redirect to login
  if (!currentStudent) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
