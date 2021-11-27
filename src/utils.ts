import * as THREE from "three";

export const vec = (pos: number[]) => new THREE.Vector3(...pos);
export type Vector = [number, number, number];

export const pairs = <T>(arr: T[]) => {
  const result: [T, T][] = [];
  arr.forEach((val, idx) => {
    if (idx === arr.length - 1) return;
    result.push([val, arr[idx + 1]]);
  });
  return result;
};
