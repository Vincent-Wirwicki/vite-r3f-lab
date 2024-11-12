import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ImagePlane from "./mesh/ImagePlane";

const Scene = () => {
  const images = [
    "/images/philip-oroni.jpg",
    "/images/steve-johnson-02.jpg",
    "/images/li-zhang.jpg",
    "/images/mike-uderevsky.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isAnim, setIsAnim] = useState(false);

  const handleNext = () => {
    if (isAnim) return;
    setIsAnim(true);
    setNext((next + 1) % images.length);
  };

  const handlePrev = () => {
    if (isAnim) return;
    setIsAnim(true);
    setNext((next - 1 + images.length) % images.length);
  };

  const selectArtist = (i: number) => {
    if (isAnim) return;
    setIsAnim(true);
    setNext(i);
  };

  const updateStates = () => {
    setIsAnim(false);
    setCurrent(next);
  };

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
            next={next}
            update={updateStates}
            isAnim={isAnim}
          />
        </Canvas>
      </div>
      <div className="w-3/5 flex justify-center items-center gap-5">
        <button className="border-b p-2" onClick={handlePrev}>
          Prev
        </button>
        <button className="border-b p-2" onClick={handleNext}>
          Next
        </button>
      </div>
    </section>
  );
};

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
