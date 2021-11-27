import { Plane } from "@react-three/drei";
import React from "react";
import { vec, Vector } from "./utils";
import Wall from "./Wall";

export default ({ size, location }: { size: Vector; location: Vector }) => {
  //  N
  // W  E
  // S
  const NW: Vector = [location[0] - size[0] / 2, 0, location[2] + size[2] / 2];
  const NE: Vector = [location[0] + size[0] / 2, 0, location[2] + size[2] / 2];
  const SW: Vector = [location[0] - size[0] / 2, 0, location[2] - size[2] / 2];
  const SE: Vector = [location[0] + size[0] / 2, 0, location[2] - size[2] / 2];
  return (
    <>
      <Wall
        from={NW}
        to={NE}
        doors={[{ offset: 1 }]}
        windows={[{ offset: 2 }]}
      />
      <Wall from={NW} to={SW} />
      <Wall from={NE} to={SE} />
      <Wall from={SW} to={SE} />
      <Plane
        rotation={[Math.PI / 2, -Math.PI, 0]}
        position={location}
        scale={[size[0], size[2], 1]}
      >
        <meshPhongMaterial color="gray" />
      </Plane>
    </>
  );
};
