import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { disconnectSocket } from '../lib/socket';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
  };

  return { user, token, isAuthenticated, logout: handleLogout };
}
