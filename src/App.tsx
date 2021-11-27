import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import {
  Line,
  OrthographicCamera,
  PerspectiveCamera,
  Plane,
  Sphere,
} from "@react-three/drei";
import Wall from "./Wall";
import { vec } from "./utils";
import Room from "./Room";

function Camera() {
  const ref = useRef<THREE.PerspectiveCamera>();
  useEffect(() => {
    ref.current?.lookAt(vec([0, 1, 0]));
  });
  useFrame(({ clock }) => {
    if (ref.current) {
      // const time = Math.PI + clock.getElapsedTime() / 3;
      const time = Math.PI + 2.5;
      ref.current.position.x = Math.sin(time) * 15;
      ref.current.position.y = 10 + Math.sin(time * 3) * 5;
      ref.current.position.z = Math.cos(time) * 15;
      ref.current?.lookAt(vec([0, 0, 0]));
    }
  });
  return (
    <OrthographicCamera
      ref={ref}
      position={[2, 3, 2]}
      // rotation={[-90, 0, 90]}
      // zoom={1}
      zoom={100}
      makeDefault
    />
  );
}

function App() {
  return (
    <div className="App">
      <Suspense fallback={"Fallback..."}>
        <Canvas>
          <ambientLight position={[10, 10, 0]} />
          <Camera />
          <pointLight position={[10, 10, 10]} />
          {/* <Room location={[-2, 0, -2]} size={[4, 0, 4]} />
          <Room location={[2, 0, -2]} size={[4, 0, 4]} />
          <Room location={[2, 0, 2]} size={[4, 0, 4]} />
          <Room location={[-2, 0, 2]} size={[4, 0, 4]} /> */}
          <Wall from={[-3, 0, -3]} to={[3, 0, -3]} />
          {/* <Wall from={[-3, 0, 3]} to={[-3, 0, -3]} /> */}
          {/* <Wall from={[5, 0, 2]} to={[-2, 0, -2]} /> */}
          {/* <Wall from={[3, 0, 3]} to={[3, 0, -3]} /> */}
          {/* <Wall from={[3, 0, 0]} to={[-2, 0, 0]} /> */}
          {/* <Wall from={[3, 0, 0]} to={[6, 0, 0]} /> */}
          <Line
            points={[
              [0, 0, 0],
              [0, 1, 0],
              // [1, 0, 0],
              // [0, 0, 1],
            ]}
            color="green"
          />
          <Line
            points={[
              [0, 0, 0],
              [1, 0, 0],
              // [1, 0, 0],
              // [0, 0, 1],
            ]}
            color="red"
          />
          <Line
            points={[
              [0, 0, 0],
              [0, 0, 1],
              // [1, 0, 0],
              // [0, 0, 1],
            ]}
            color="blue"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
