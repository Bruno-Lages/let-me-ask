import '../style/copyCode.css';

import copyIcon from '../assets/copy.svg';

// eslint-disable-next-line react/prop-types
export function Copycode({ param }) {
    function copyCodeToClipBoard() {
        navigator.clipboard.writeText(param);
    }
    return (
        <button type="button" className="copy" onClick={copyCodeToClipBoard}>
            <div className="copyIcon"><img src={copyIcon} alt="clipBoard" /></div>
            <span className="code">
                Room
                {' '}
                { param }
            </span>
        </button>
    );
}
