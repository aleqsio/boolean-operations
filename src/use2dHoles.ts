import { pairs } from "./utils";

type Hole = [number, number, number, number]; // x1, y1, x2, y2 scaled from 1 to 0
export const use2dHoles = (holes: Hole[]) => {
  const rectangles: [number, number, number, number][] = [];
  const horizontalChangePoints = [
    ...new Set([
      0,
      ...holes.map<number>((hole) => hole[0]),
      ...holes.map<number>((hole) => hole[2]),
      1,
    ]),
  ].sort((a, b) => a - b);
  const horizontalChangePairs = pairs(horizontalChangePoints);
  horizontalChangePairs.forEach(([x1, x2]) => {
    const relevantHoles = holes.filter((hole) => hole[0] <= x1 && hole[2] > x1);
    const verticalChangePoints = [
      ...new Set([
        0,
        ...relevantHoles.map<number>((hole) => hole[1]),
        ...relevantHoles.map<number>((hole) => hole[3]),
        1,
      ]),
    ].sort((a, b) => a - b);
    const verticalChangePairs = pairs(verticalChangePoints);
    verticalChangePairs.forEach(([y1, y2]) => {
      if (relevantHoles.some((hole) => hole[1] === y1 && hole[3] === y2)) {
      } else {
        rectangles.push([x1, y1, x2, y2]);
      }
    });
  });
  return rectangles;
};
