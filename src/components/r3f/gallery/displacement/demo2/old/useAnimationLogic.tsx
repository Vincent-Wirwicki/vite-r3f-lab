import { useState } from "react";
import { useMotionValue, animate } from "motion/react";

const useAnimationLogic = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(0);
  const [isAnim, setIsAnim] = useState(false);
  const [isFinish, setIsFinish] = useState(true);
  const progress = useMotionValue(0);

  const transition = () => {
    animate(progress, 1, {
      duration: 0.5,
      ease: "circInOut",
      onComplete: () => {
        setCurrent(next);
        setIsAnim(false);
        setIsFinish(true);
        progress.set(0);
      },
    });
  };

  const selectArtist = (i: number) => {
    if (isAnim || next === i) return;
    setIsAnim(true);
    setIsFinish(false);
    setNext(i);
    transition();
  };

  return { selectArtist, current, next, isFinish, progress };
};

export default useAnimationLogic;
