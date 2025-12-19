import { render } from "preact";
import "./style.css";

export function App() {
  return (
    <div>
      <h3>Hello world</h3>
    </div>
  );
}

render(<App />, document.getElementById("app"));
