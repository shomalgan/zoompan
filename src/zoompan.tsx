import React, {
  FunctionComponent,
  MouseEvent,
  ReactElement,
  useState,
  useRef,
  useEffect,
} from "react";
export interface DragData {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface MatrixData {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface ZoomPanProps {
  height?: string;
  width?: string;
  className?: string;
  enablePan?: boolean;
  zoom?: number;
  pandx?: number;
  pandy?: number;
  onPan?: (x: number, y: number) => void;
  children: ReactElement;
}

const ZoomPan: FunctionComponent<ZoomPanProps> = ({
  enablePan = true,
  onPan = () => undefined,
  pandx = 0,
  pandy = 0,
  zoom = 1,
  className,
  height,
  width,
  children,
}) => {
  const [matrixData, setMatrixData] = useState([
    zoom,
    0,
    0,
    zoom,
    pandx,
    pandy, // [zoom, skew, skew, zoom, dx, dy]
  ]);
  const [dragData, setDragData] = useState({
    dx: pandx,
    dy: pandy,
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);

  const panWrapper = useRef<HTMLInputElement>(null);
  const panContainer = useRef<HTMLInputElement>(null);

  const onMouseDown = (e: MouseEvent<EventTarget>): void => {
    const offsetX = matrixData[4];
    const offsetY = matrixData[5];
    const newDragData: DragData = {
      dx: offsetX,
      dy: offsetY,
      x: e.pageX,
      y: e.pageY,
    };
    setDragData({
      ...newDragData,
    });
    setDragging(true);
    if (panWrapper && panWrapper.current) {
      panWrapper.current.style.cursor = "move";
    }
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const newMatrixData = [...matrixData];

    if (matrixData[0] !== zoom) {
      newMatrixData[0] = zoom || newMatrixData[0];
      newMatrixData[3] = zoom || newMatrixData[3];
    }
    if (matrixData[4] !== pandx) {
      newMatrixData[4] = pandx;
    }
    if (matrixData[5] !== pandy) {
      newMatrixData[5] = pandy;
    }
    setMatrixData(newMatrixData);
  }, [zoom, pandx, pandy]);

  const onMouseUp = () => {
    setDragging(false);
    if (panWrapper && panWrapper.current) {
      panWrapper.current.style.cursor = "";
    }
    if (onPan) {
      onPan(matrixData[4], matrixData[5]);
    }
  };

  const getNewMatrixData = (x: number, y: number): number[] => {
    const deltaX = dragData.x - x;
    const deltaY = dragData.y - y;
    matrixData[4] = dragData.dx - deltaX;
    matrixData[5] = dragData.dy - deltaY;
    return matrixData;
  };
  const onMouseMove = (e: MouseEvent<EventTarget>): void => {
    setMatrixData(getNewMatrixData(e.pageX, e.pageY));
    if (panContainer && panContainer.current) {
      panContainer.current.style.transform = `matrix(${matrixData.toString()})`;
    }
  };
  return (
    <div
      className={`pan-container ${className || ""}`}
      onMouseDown={enablePan ? onMouseDown : undefined}
      onMouseUp={onMouseUp}
      onMouseMove={dragging ? onMouseMove : undefined}
      style={{
        height,
        userSelect: "none",
        width,
      }}
      ref={panWrapper}
    >
      <div
        ref={panContainer}
        style={{
          transform: `matrix(${matrixData.toString()})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ZoomPan;
