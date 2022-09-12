import { useLayoutEffect, useState } from "preact/hooks";

export const useWindowSize = (): { [T: string]: number } => {
  const getSize = (): { [T: string]: number } => ({
    width: self.innerWidth,
    height: self.innerHeight,
  });
  const [windowSize, setWindowSize] = useState(getSize);
  useLayoutEffect(() => {
    const onResize = () => setWindowSize(getSize);
    self.addEventListener("resize", onResize);
    return (): void => self.removeEventListener("resize", onResize);
  }, []);
  return windowSize;
};
