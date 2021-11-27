import { Box, useTexture } from "@react-three/drei";
import { useFrame, useLoader, Vector3 } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import THREE, { BoxGeometry, Mesh, RepeatWrapping, TextureLoader } from "three";
import { use2dHoles } from "./use2dHoles";
import { vec, Vector } from "./utils";

type Door = {
  offset: number;
  width?: number;
  height?: number;
};

type Window = {
  offset: number;
  offsetY?: number;
  width?: number;
  height?: number;
};
const SCALE = 0.5;
const UvScalelableGeometry = ({
  uvScale,
  offsets,
  ...props
}: {
  uvScale: number[];
  offsets: number[][];
}) => {
  const ref = useRef<BoxGeometry>();
  useEffect(() => {
    if (ref.current) {
      // ref.current.attributes.uv.array.forEach((v, i) => {
      //   ref.current.attributes.uv.setXYZW(i, 1, 1, 1, 1);
      //   // ref.current.attributes.uv.setX(i, 1);

      //   // ref.current.attributes.uv.setY(i, 1);
      //   // ref.current.attributes.uv.setZ(i, 1);
      // });

      const uvs = ref.current.getAttribute("uv");
      const isLeftFacing = (i: number) => Math.floor(i / 6) % 2 === 0;
      for (var i = 0, len = uvs.count; i < len; i += 4) {
        const faceNumber = i / 4;

        const offset = offsets[faceNumber];
        // xy point, 4 makes a face
        const [xs, ys, zs] = uvScale;
        const faceUvScale = [
          [zs, ys],
          [xs, zs],
          [xs, ys],
        ][Math.floor(faceNumber / 2)];

        // if (faceNumber === 5) {
        //   uvs.setXY(i + 0, -0.535, 0.3);
        //   uvs.setXY(i + 1, -0.623, 0.57);
        //   uvs.setXY(i + 2, -0.1, 0.1);
        //   uvs.setXY(i + 3, -0.5, 0.3);
        // }

        uvs.setXY(i, offset[0], offset[1] + faceUvScale[1] * SCALE);
        uvs.setXY(
          i + 1,
          offset[0] + faceUvScale[0] * SCALE,
          offset[1] + faceUvScale[1] * SCALE
        );

        uvs.setXY(i + 2, offset[0], offset[1]);
        uvs.setXY(i + 3, offset[0] + faceUvScale[0] * SCALE, offset[1]);

        //  let offset = isLeftFacing(i) ? leftOffset : rightOffset;
        //  const x1 = offset[0];
        //  const y1 = offset[1] + uvScale[1] * SCALE;
        //  const z1 = offset[0] + uvScale[0] * SCALE;
        //  const w1 = offset[1] + uvScale[1] * SCALE;
        //  uvs.setXY(i, x1, y1);
        //  uvs.setXY(i + 1, z1, w1);
        //  const x2 = offset[0];
        //  const y2 = offset[1];
        //  const z2 = offset[0] + uvScale[0] * SCALE;
        //  const w2 = offset[1];
        //  uvs.setXY(i + 2, x2, y2);
        //  uvs.setXY(i + 3, z2, w2);
      }
      ref.current.attributes.uv.needsUpdate = true;
      ref.current.setAttribute("uv", uvs);
      // myMesh.current.setAttribute("uv") = clock.getElapsedTime();
    }
  }, [uvScale, offsets]);
  return <boxGeometry ref={ref} args={[1, 1, 1]} />;
};

export default ({
  from,
  to,
  type = "inner",
  height = 2,
  doors,
  windows,
}: {
  from: Vector;
  to: Vector;
  type?: "inner" | "outer";
  height?: number;
  doors?: Door[];
  windows?: Window[];
}) => {
  const rectangles = use2dHoles([
    // x1, y1, x2, y2 scaled from 1 to 0
    [0.1, 0.1, 0.8, 0.3],
    [0.3, 0.5, 0.5, 0.7],
    [0.1, 0.1, 0.3, 0.3],
    // [0.4, 0, 0.6, 0.5],
    // [0.5, 0.6, 0.6, 0.8],
  ]);
  const props = useTexture({
    map: "assets/Stylized_Bricks_001_basecolor.jpg",
    // map: "assets/uv.png",
    aoMap: "assets/Stylized_Bricks_001_ambientOcclusion.jpg",
    // "assets/Stylized_Bricks_001_height.png",
    normalMap: "assets/Stylized_Bricks_001_normal.jpg",
    roughnessMap: "assets/Stylized_Bricks_001_roughness.jpg",
  });
  props.map.wrapS = RepeatWrapping;
  props.map.wrapT = RepeatWrapping;
  const length = vec(from).distanceTo(vec(to));
  const angle = vec(to)
    .sub(vec(from))
    .angleTo(vec([1, 0, 0]));
  console.log(rectangles);
  const width = { inner: 0.1, outer: 0.3 }[type];
  return (
    <group
      rotation={[0, angle, 0]}
      position={vec(from)
        .add(vec(to))
        .multiplyScalar(0.5)
        .add(vec([0, height / 2, 0]))}
      scale={[length, height, width]}
    >
      {rectangles.map((rectangle, idx) => (
        <mesh
          key={`${idx}_1`}
          scale={[rectangle[2] - rectangle[0], rectangle[3] - rectangle[1], 1]}
          // rotation={[0, 0, 0]} //[0, vec(from).angleTo(vec(to)), 0]}
          position={vec([
            rectangle[0] + (rectangle[2] - rectangle[0]) / 2 - 0.5,
            rectangle[1] + (rectangle[3] - rectangle[1]) / 2 - 0.5,
            0,
          ])}
        >
          <UvScalelableGeometry
            uvScale={[
              length * (rectangle[2] - rectangle[0]),
              height * (rectangle[3] - rectangle[1]),
              width,
            ]}
            offsets={[
              [
                SCALE * length * (1 - rectangle[2]),
                SCALE * height * rectangle[1],
              ],
              [
                SCALE * length * (1 - rectangle[2]),
                SCALE * height * rectangle[1],
              ],
              [SCALE * length * rectangle[0], 1 - SCALE * width],
              [SCALE * length * (1 - rectangle[2]), 1 - SCALE * width],
              [SCALE * length * rectangle[0], SCALE * height * rectangle[1]],
              [
                SCALE * length * (1 - rectangle[2]),
                SCALE * height * rectangle[1],
              ],
            ]}
            // leftOffset={[
            //   SCALE * length * rectangle[0],
            //   SCALE * height * rectangle[1],
            //   0,
            // ]}
            // rightOffset={[
            //   SCALE * length * (1 - rectangle[2]),
            //   SCALE * height * rectangle[1],
            //   0,
            // ]}
          />
          <meshStandardMaterial attach="material" {...props} />
        </mesh>
      ))}
    </group>
  );
};
