import Image, { StaticImageData } from "next/image";
import React, { ChangeEvent, Suspense, useEffect, useState } from "react";

import * as mobilenet from "@tensorflow-models/mobilenet";
import image from "../../../public/cup.jpg";
interface Predictions {
  className: string;
  probability: number;
}
function ImageRecognitionComponent() {
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  const [pickedImage, setPickedImage] = useState<StaticImageData | string>(
    image
  );
  const [predictions, setPredictions] = useState<Array<Predictions>>();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPickedImage(imageUrl);
    }
  };

  useEffect(() => {
    async function run() {
      const version = 2 as mobilenet.MobileNetVersion;
      const alpha = 0.5 as mobilenet.MobileNetAlpha;
      const img = document.getElementById("image") as HTMLImageElement;
      const model = await mobilenet.load({ version, alpha });

      const prediction = await model.classify(img);
      setPredictions(prediction);
    }

    run();
  }, [pickedImage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        Choose image to precit:{" "}
        <input type="file" onChange={handleImageChange} />
      </div>
      <div className="">Image to predict:</div>
      <Image
        src={pickedImage}
        alt="image"
        id="image"
        width={500}
        height={500}
      />
      <div className="flex flex-col gap-4 py-4">
        <h1 className="underline text-4xl">Predictions: </h1>
        <Suspense fallback={<Loading />}>
          {predictions?.map((item) => (
            <div className="" key={item.className}>
              <h2>
                Classification: <b>{item.className}</b>
              </h2>
              <h2>Probability: {item.probability}</h2>
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default ImageRecognitionComponent;
