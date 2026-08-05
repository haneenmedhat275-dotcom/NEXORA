import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithToken } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      loginWithToken(token).finally(() => navigate('/dashboard'));
    } else {
      navigate('/login');
    }
  }, [navigate, loginWithToken]);

  return null;
}