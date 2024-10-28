import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ImagePlane from "./mesh/ImagePlane";

const Scene = () => {
  const images = [
    "/images/nick-design.jpg",
    "/images/steve-johnson-01.jpg",
    "/images/steve-johnson.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isAnim, setIsAnim] = useState(false);

  const handleNext = () => {
    if (!isAnim) {
      setIsAnim(true);
      setNext((next + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (!isAnim) {
      setIsAnim(true);
      setNext((next - 1 + images.length) % images.length);
    }
  };

  const updateStates = () => {
    setIsAnim(false);
    setCurrent(next);
  };

  return (
    <>
      <button className="fixed z-20 top-1/2 left-1/2" onClick={handleNext}>
        next
      </button>
      <button className="fixed z-20 top-1/2 left-1/3" onClick={handlePrev}>
        prev
      </button>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ImagePlane
          tex={images}
          active={current}
          next={next}
          update={updateStates}
          isAnim={isAnim}
        />
      </Canvas>
    </>
  );
};

export default Scene;
