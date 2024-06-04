import React from "react";
import { Handle, Position, XYPosition } from "reactflow";
import { SquareData, SwimlaneData } from "../models/Model";
import { findSwimlaneFromTag } from "./Swimlane";

export const SQUARE_WIDTH = 120;
export const SQUARE_SPACING = 50;
export const SQUARE_STARTING_X = 40;
export const SQUARE_SIZE = SQUARE_WIDTH + SQUARE_SPACING;

export enum SourceDirections {
  RIGHT = "source_right",
  TOP = "source_top",
  BOTTOM = "source_bottom",
}

enum TargetDirections {
  LEFT = "target_right",
  TOP = "target_top",
  BOTTOM = "target_bottom",
}

export function findEdgeHandleSource(from: XYPosition, to: XYPosition): string {
  if (from.x == to.x && from.y > to.y) return SourceDirections.TOP;
  if (from.x == to.x && from.y < to.y) return SourceDirections.BOTTOM;
  return SourceDirections.RIGHT;
}

export function findEdgeHandleTarget(from: XYPosition, to: XYPosition): string {
  if (from.x == to.x && from.y > to.y) return TargetDirections.BOTTOM;
  if (from.x == to.x && from.y < to.y) return TargetDirections.TOP;
  return TargetDirections.LEFT;
}

export function isSquareSlotOccupied(
  squareDatas: SquareData[],
  xPosition: number,
  parent: string
): boolean {
  return squareDatas.some(
    (square) => square.xPosition === xPosition && square.parent === parent
  );
}

export function findSquarePositionFromVariable(
  swimlanes: SwimlaneData[],
  squares: SquareData[],
  variable: string
): XYPosition {
  let squarePosition: XYPosition = { x: -1, y: -1 };
  squares.forEach((squareData) => {
    if (squareData.variable === variable) {
      squarePosition = {
        x: squareData.xPosition,
        y: findSwimlaneFromTag(swimlanes, squareData.parent)!.yPosition,
      };
    }
  });

  return squarePosition;
}
const Square = ({ data }: any) => {
  return (
    <>
      <div className="square-body" style={{ width: SQUARE_WIDTH + "px" }}>
        <div className="square-label-text">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
        id={SourceDirections.RIGHT}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ visibility: "hidden" }}
        id={TargetDirections.LEFT}
      />
      <Handle
        type="source"
        position={Position.Top}
        style={{ visibility: "hidden" }}
        id={SourceDirections.TOP}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
        id={TargetDirections.TOP}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ visibility: "hidden" }}
        id={SourceDirections.BOTTOM}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ visibility: "hidden" }}
        id={TargetDirections.BOTTOM}
      />
    </>
  );
};

export default Square;
