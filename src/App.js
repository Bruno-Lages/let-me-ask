import { Route, BrowserRouter } from 'react-router-dom';

import { AuthContext } from './contexts/authContext';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

import './style/globalStyle.css';

function App() {
    return (
        <AuthContext>
            <BrowserRouter>
                <Route path="/" exact component={Home} />
                <Route path="/newRoom" component={NewRoom} />
            </BrowserRouter>
        </AuthContext>
    );
}

export default App;
