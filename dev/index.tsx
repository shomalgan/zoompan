import * as React from "react";
import * as ReactDOM from "react-dom";
import ZoomPan from "../src/zoompan";
import IconSVG from "./components/IconSVG";
import "./index.scss";

const ZoomPanDemo: React.FunctionComponent = () => {
  const [state, setState] = React.useState({
    dx: 0,
    dy: 0,
    zoom: 1,
    enablePan: true,
  });
  const zoomIn = () => {
    setState({
      ...state,
      zoom: state.zoom + 0.2,
    });
  };
  const zoomOut = () => {
    setState({
      ...state,
      zoom: state.zoom - 0.2,
    });
  };
  const onPan = (dx, dy) => {
    setState({
      ...state,
      dx,
      dy,
    });
  };

  const onReset = () => {
    setState({
      ...state,
      dx: 0,
      dy: 0,
      zoom: 1,
    });
  };

  return (
    <>
      <div className="header">React Pan and Zoom</div>
      <div className="toolbar">
        <div data-cypress-id="zoom-in-btn" onClick={zoomIn}>
          <IconSVG name="icon-zoom-in" />
        </div>
        <div data-cypress-id="zoom-out-btn" onClick={zoomOut}>
          <IconSVG name="icon-zoom-out" />
        </div>
        <div data-cypress-id="reset-btn" onClick={onReset}>
          <IconSVG name="icon-hand-rock-o" />
        </div>
      </div>
      <ZoomPan
        className="container"
        enablePan={state.enablePan}
        zoom={state.zoom}
        pandx={state.dx}
        pandy={state.dy}
        onPan={onPan}
      >
        <img src="https://i.imgur.com/WJ17gs5.jpg" />
      </ZoomPan>
    </>
  );
};

ReactDOM.render(<ZoomPanDemo />, document.getElementById("zoompan"));
