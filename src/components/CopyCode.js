import '../style/copyCode.css';

import copyIcon from '../assets/copy.svg';

export function Copycode() {
    return (
        <button type="button" className="copy">
            <div className="copyIcon"><img src={copyIcon} alt="clipBoard" /></div>
            <span className="code">Sala #123456789</span>
        </button>
    );
}
