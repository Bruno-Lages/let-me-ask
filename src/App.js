import { Route, BrowserRouter, Switch } from 'react-router-dom';

import { AuthContext } from './contexts/authContext';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import './style/globalStyle.css';
import './style/darkMode.css';

function App() {
    return (
        <AuthContext>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/newRoom" component={NewRoom} />
                    <Route path="/rooms/:id" component={Room} />
                    <Route path="/admin/rooms/:id" component={AdminRoom} />
                </Switch>
            </BrowserRouter>
        </AuthContext>
    );
}

export default App;
