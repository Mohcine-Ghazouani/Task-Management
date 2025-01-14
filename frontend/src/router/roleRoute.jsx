import { useNavigate } from 'react-router-dom';
import { UseUserContext } from '../context/UserContext';
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE } from '../router/index';


export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = UseUserContext();
  return user && user.role === 'Admin' ? children : navigate(ADMIN_DASHBOARD_ROUTE);;
};

export const MemberRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = UseUserContext();
  return user && user.role === 'Member' ? children : navigate(DASHBOARD_ROUTE);;
};
