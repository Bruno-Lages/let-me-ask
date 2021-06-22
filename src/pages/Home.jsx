import React from 'react';

import { Button } from './../components/Button'

import './../style/homeStyle.css';

import svgImage from './../assets/illustration.svg';
import logo from './../assets/logo.svg';
import googleLogo from './../assets/google-icon.svg';

export function Home(){
    return (
    <div className="homepage">
        <aside>
           <img src={svgImage} alt="illustration representing questions and answers" />
           <h1>Every question has an answer</h1>
           <p>Learn and share knowledge with other people</p> 
        </aside>

        <main>
            <div className="authentication">
                <img src={logo} alt="let me ask logo" />
                <button>
                    <img src={googleLogo} alt="Google logo" />
                    <p>create an account with Google</p>
                </button>
                <p className="hint">or join some room</p>
                <form action="">
                    <input type="text" name="roomId" placeholder="Type the room Id" aria-placeholder="Type the room Id"/>
                    <Button type="submit">join this room</Button>
                </form>
            </div>
        </main>
    </div>
    )
};