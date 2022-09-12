import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

import Image from "../components/Image.tsx";

export default function RunnerBoy() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [runners, setRunners] = useState([
    <Image x={100} y={100} />,
  ]);

  const handleMouseMove = (event: any) => {
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const handleClick = () => {
    // console.log(coords);
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
