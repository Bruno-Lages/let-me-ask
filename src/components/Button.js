/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import '../style/button.css';

export function Button(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <button className="button" {...props}>{props.children}</button>;
}
