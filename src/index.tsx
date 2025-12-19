import { render } from "preact";
import "./style.css";
import { TriangleGameApp } from "./models/Game";

render(<TriangleGameApp />, document.getElementById("app"));
