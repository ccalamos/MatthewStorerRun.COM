import { JSX } from "preact";
import { useState } from "preact/hooks";

import Image from "../components/Image.tsx";

interface IMouseTarget extends EventTarget {
  offsetLeft?: number;
  offsetTop?: number;
}

interface IMouseMove extends JSX.TargetedMouseEvent<HTMLDivElement> {
  target: IMouseTarget | null;
}

export default function RunnerBoy() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [runners, setRunners] = useState([
    <Image x={100} y={100} />,
  ]);

  const handleMouseMove = (event: IMouseMove) => {
    setCoords({
      x: event.clientX - (event.target?.offsetLeft ?? 0),
      y: event.clientY - (event.target?.offsetTop ?? 0),
    });
  };

  const handleClick = () => {
    setRunners([
      ...runners,
      <Image x={coords.x - 88} y={coords.y - 92} />,
    ]);
  };

  return (
    <div
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      class="h-full w-full"
    >
      {runners}
    </div>
  );
}
