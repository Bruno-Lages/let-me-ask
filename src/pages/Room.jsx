import { Link } from 'react-router-dom';

import { Button } from '../components/Button';
import { Copycode } from '../components/CopyCode';

import '../style/room.css';
import logo from '../assets/logo.svg';

export function Room() {
    return (
        <div>
            <header>
                <img src={logo} alt="let me ask logo" />
                <Copycode />
            </header>

            <main>
                <form className="room-form">
                    <h1 className="room-name">Title</h1>
                    <textarea name="" cols="120" rows="6" className="question" placeholder="What do you want to ask?" aria-placeholder="What do you want to ask?" />
                    <footer>
                        <p className="hint">
                            To send a question,
                            <Link to="/">make a login</Link>
                        </p>
                        <Button type="submit">Send a question</Button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
