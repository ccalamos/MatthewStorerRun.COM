import {
  Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "preact/hooks";

import { useWindowSize } from "../hooks/windowSize.ts";

interface IControlRef {
  animate?: number;
  parentWidth?: number;
  parentHeight?: number;
  childWidth?: number;
  childHeight?: number;
  isMovingRight?: boolean;
  isMovingDown?: boolean;
  isVisible?: boolean;
}

const Image = (props: { x: number; y: number }) => {
  const controlRef = useRef<IControlRef>({});
  const previousTimeRef = useRef<number>();
  const imageRef = useRef<HTMLImageElement>();
  const boundRef = useRef<HTMLDivElement>();

  const [speed] = useState((Math.random() * (4 - 1 + 1) + 1) / 10);
  const [positionX, setPositionX] = useState<number>(props.x);
  const [positionY, setPositionY] = useState<number>(props.y);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

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
      controlRef.current.isMovingRight = Math.random() > 0.5;
      controlRef.current.isMovingDown = Math.random() > 0.5;
    }
  }, [imageRef, boundRef, controlRef, windowWidth, windowHeight]);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const move = (time - previousTimeRef.current) * speed;
      const parentWidth = controlRef.current.parentWidth ?? 0;
      const parentHeight = controlRef.current.parentHeight ?? 0;
      const width = controlRef.current.childWidth ?? 0;
      const height = controlRef.current.childHeight ?? 0;
      const setPosX = (prevPos: number) => {
        const positionWithinRange = Math.min(
          Math.max(prevPos, 0),
          parentWidth - width,
        );
        if (positionWithinRange >= parentWidth - width) {
          controlRef.current.isMovingRight = false;
        }
        if (positionWithinRange <= 0) {
          controlRef.current.isMovingRight = true;
        }
        return controlRef.current.isMovingRight
          ? positionWithinRange + move
          : positionWithinRange - move;
      };
      const setPosY = (prevPos: number) => {
        const positionWithinRange = Math.min(
          Math.max(prevPos, 0),
          parentHeight - height,
        );
        if (positionWithinRange >= parentHeight - height) {
          controlRef.current.isMovingDown = false;
        }
        if (positionWithinRange <= 0) {
          controlRef.current.isMovingDown = true;
        }
        return controlRef.current.isMovingDown
          ? positionWithinRange + move
          : positionWithinRange - move;
      };
      setPositionX(setPosX);
      setPositionY(setPosY);
    }
    previousTimeRef.current = time;
    controlRef.current.animate = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform =
        `translate(${positionX}px, ${positionY}px)`;
    }
  }, [positionX, positionY]);

  const onVisibilityChange = () => {
    controlRef.current.isVisible = !document.hidden;
    if (document.hidden && (controlRef.current.animate !== undefined)) {
      cancelAnimationFrame(controlRef.current.animate);
    } else {
      controlRef.current.animate = requestAnimationFrame(animate);
    }
  };

  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange, false);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [onVisibilityChange]);

  useLayoutEffect(() => {
    if (controlRef.current) {
      controlRef.current.animate = requestAnimationFrame(animate);
    }
    return () => {
      if (controlRef.current.animate !== undefined) {
        cancelAnimationFrame(controlRef.current.animate);
      }
    };
  }, [controlRef]);

  return (
    <div
      ref={boundRef as Ref<HTMLDivElement>}
      class="absolute h-full w-full"
    >
      <img
        ref={imageRef as Ref<HTMLImageElement>}
        class={`absolute h-48 w-44 pointer-events-none select-none`}
        style={`transform: translate(${props.x}px, ${props.y}px);`}
        src="/TheDunce.png"
      />
    </div>
  );
};

export default Image;
