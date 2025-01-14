import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ImagePlane from "./mesh/ImagePlane";
import { useMotionValue, animate } from "motion/react";

const Scene = () => {
  const images = [
    "/images/philip-oroni.jpg",
    "/images/steve-johnson-02.jpg",
    "/images/li-zhang.jpg",
    "/images/mike-uderevsky.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(0);
  const [isAnim, setIsAnim] = useState(false);
  const [isFinish, setIsFinish] = useState(true);
  const [direction, setDirection] = useState(1);
  const progress = useMotionValue(0);

  const prevIndex = (next - 1 + images.length) % images.length;
  const nextIndex = (next + 1) % images.length;

  const transition = () => {
    animate(progress, 1, {
      duration: 0.75,
      // ease: "circInOut",
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
    setNext(i);
    const dir = i > next || (i === 0 && next === images.length - 1) ? -1 : 1;
    setDirection(dir);
    setIsAnim(true);
    setIsFinish(false);
    transition();
  };
  // main component
  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center ">
      <div className="flex flex-col justify-center items-center w-3/5 py-4">
        <h2 className="text-2xl font-bold py-2">Selected artist </h2>
        <ArtistList current={next} selectArtist={selectArtist} />
      </div>
      <div className="w-3/5 h-3/5">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ImagePlane
            images={images}
            active={current}
            isFinish={isFinish}
            next={next}
            progress={progress}
            direction={direction}
          />
        </Canvas>
      </div>
      <div className="w-3/5 flex justify-center items-center gap-5">
        <SimpleBtn text="prev" index={prevIndex} selectArtist={selectArtist} />
        <SimpleBtn text="next" index={nextIndex} selectArtist={selectArtist} />
      </div>
    </section>
  );
};

// simple prev and next button
const SimpleBtn = ({
  text,
  index,
  selectArtist,
}: {
  text: string;
  index: number;
  selectArtist: (i: number) => void;
}) => (
  <button className="border-b p-2" onClick={() => selectArtist(index)}>
    {text}
  </button>
);

// artist list
const ArtistList = ({
  current,
  selectArtist,
}: {
  current: number;
  selectArtist: (i: number) => void;
}) => {
  const artists = [
    "Philip Oroni",
    "Steve Johnson",
    "Li Zhang",
    "Mike Uderevsky",
  ];
  return (
    <ul className="flex items-center gap-5">
      {artists.map((artist, i) => (
        <li
          className={`cursor-pointer font-bold ${
            current === i ? "text-orange-400" : "text-neutral-200"
          }`}
          key={`${artist}---${i}`}
          onClick={() => selectArtist(i)}
        >
          {artist}
        </li>
      ))}
    </ul>
  );
};

export default Scene;
