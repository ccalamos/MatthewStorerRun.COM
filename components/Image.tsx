import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

import { useWindowSize } from "../hooks/windowSize.ts";

const Image = (props: { x: number; y: number }) => {
  const controlRef = useRef<any>({});
  const previousTimeRef = useRef<number>();
  const imageRef = useRef<any>();
  const boundRef = useRef<any>();

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
      const parentWidth = controlRef.current.parentWidth;
      const parentHeight = controlRef.current.parentHeight;
      const width = controlRef.current.childWidth;
      const height = controlRef.current.childHeight;
      const setPosX = (prevPos: number) => {
        const positionWithinRange = Math.min(
          Math.max(prevPos, 0),
          parentWidth - width,
        );
        if (positionWithinRange >= parentWidth - width) {
          controlRef.current.isMovingRight = false;
          controlRef.current.impactCount = controlRef.current.impactCount + 1;
        }
        if (positionWithinRange <= 0) {
          controlRef.current.isMovingRight = true;
          controlRef.current.impactCount = controlRef.current.impactCount + 1;
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
          controlRef.current.impactCount = controlRef.current.impactCount + 1;
        }
        if (positionWithinRange <= 0) {
          controlRef.current.isMovingDown = true;
          controlRef.current.impactCount = controlRef.current.impactCount + 1;
        }
        return controlRef.current.isMovingDown
          ? positionWithinRange + move
          : positionWithinRange - move;
      };
      setPositionX(setPosX);
      setPositionY(setPosY);
    }
    previousTimeRef.current = time;
    controlRef.current.animte = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform =
        `translate(${positionX}px, ${positionY}px)`;
    }
  }, [positionX, positionY]);

  const onVisibilityChange = () => {
    controlRef.current.isVisible = !document.hidden;
    if (document.hidden) {
      cancelAnimationFrame(controlRef.current.animte);
    } else {
      controlRef.current.animte = requestAnimationFrame(animate);
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
      controlRef.current.animte = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(controlRef.current.animte);
    };
  }, [controlRef]);

  return (
    <div
      ref={boundRef}
      class="absolute h-full w-full"
    >
      <img
        ref={imageRef}
        class={`absolute h-48 w-44 pointer-events-none select-none`}
        style={`transform: translate(${props.x}px, ${props.y}px);`}
        src="/TheDunce.png"
      />
    </div>
  );
};

export default Image;
