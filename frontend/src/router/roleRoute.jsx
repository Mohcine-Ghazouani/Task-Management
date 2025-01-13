import { Navigate } from 'react-router-dom';
import { UseUserContext } from '../context/UserContext';

export const AdminRoute = ({ children }) => {
  const { user } = UseUserContext();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

export const MemberRoute = ({ children }) => {
  const { user } = UseUserContext();
  return user && user.role === 'member' ? children : <Navigate to="/" />;
};
