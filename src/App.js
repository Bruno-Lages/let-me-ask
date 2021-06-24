import { Route, BrowserRouter, Switch } from 'react-router-dom';

import { AuthContext } from './contexts/authContext';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

import './style/globalStyle.css';

function App() {
    return (
        <AuthContext>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/newRoom" component={NewRoom} />
                    <Route path="/rooms/:id" component={Room} />
                </Switch>
            </BrowserRouter>
        </AuthContext>
    );
}

export default App;
