import { useState } from "preact/hooks";

import RunnerBoy from "../islands/RunnerBoy.tsx";

export default function Home() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [runners, setRunners] = useState([<RunnerBoy x={0} y={0} />]);

  const handleMouseMove = (event: any) => {
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const handleClick = () => {
    setRunners([
      ...runners,
      <RunnerBoy x={0} y={0} />,
    ]);
  };

  return (
    <div
      class="p-4 mx-auto w-screen h-screen"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {runners}
    </div>
  );
}
