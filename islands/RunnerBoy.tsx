import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

import { Image } from "../components/Image.tsx";

export default function RunnerBoy(props: { x: number; y: number }) {
  const controlRef = useRef<any>({});
  const imageRef = useRef<any>();
  const boundRef = useRef<any>();

  const [speed] = useState(Math.floor(Math.random() * (10 - 5 + 1) + 5));
  const [trX, setTRX] = useState(props.x);
  const [trY, setTRY] = useState(props.y);
  const [direction, setDirection] = useState<"se" | "ne" | "sw" | "nw">("se");
  const [windowWidth, setWindowWidth] = useState(self.innerWidth);
  const [windowHeight, setWindowHeight] = useState(self.innerHeight);

  const getSize = (): { [T: string]: number } => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [windowSize, setWindowSize] = useState(getSize);
  useLayoutEffect(() => {
    const onResize = () => setWindowSize(getSize);
    self.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    if (boundRef.current && imageRef.current) {
      controlRef.current.parentWidth =
        boundRef.current?.getBoundingClientRect().width;
      controlRef.current.parentHeight =
        boundRef.current?.getBoundingClientRect().height;
      controlRef.current.childWidth =
        imageRef.current?.getBoundingClientRect().width;
      controlRef.current.childHeight =
        imageRef.current?.getBoundingClientRect().height;
    }
  }, [imageRef, boundRef, controlRef, windowWidth, windowHeight]);

  const run = () => {
    requestAnimationFrame(run);
    switch (direction) {
      case "ne":
        setTRX(trX + speed);
        setTRY(trY - speed);

        if (trY <= 0) {
          setDirection("se");
        } else if (trX >= 0) {
          setDirection("nw");
        }

        break;
      case "nw":
        setTRX(trX - speed);
        setTRY(trY - speed);

        if (trY <= 0) {
          setDirection("sw");
        } else if (trX <= windowWidth) {
          setDirection("ne");
        }

        break;
      case "se":
        setTRX(trX + speed);
        setTRY(trY + speed);

        if (trY >= windowHeight) {
          setDirection("ne");
        } else if (trX >= windowWidth) {
          setDirection("sw");
        }

        break;
      case "sw":
        setTRX(trX - speed);
        setTRY(trY + speed);

        if (trY >= windowHeight) {
          setDirection("nw");
        } else if (trX <= 0) {
          setDirection("se");
        }

        break;
    }
  };

  useEffect(() => {
    setWindowHeight(self.innerHeight);
    setWindowWidth(self.innerWidth);

    run();
  }, []);

  useEffect(() => {
    console.log(trX, trY);
  }, [trX, trY]);

  return (
    <div ref={boundRef} class={`flex gap-2 h-full w-full`}>
      <Image ref={imageRef} top={props.y} left={props.x} />
    </div>
  );
}
