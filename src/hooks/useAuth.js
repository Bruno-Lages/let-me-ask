import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

export function useAuth() {
    const useValue = useContext(AuthContext);
    return useValue;
}
