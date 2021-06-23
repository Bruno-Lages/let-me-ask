import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

export function useAuth() {
    useContext(AuthContext);
}
