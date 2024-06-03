import React from "react";
import { SwimlaneData } from "../models/Model";

export const SWIMLANE_HEIGHT = 150;

export function findSwimlaneFromTag(
  swimlanes: SwimlaneData[],
  tag: string
): SwimlaneData | undefined {
  return swimlanes.find((swimlane) => swimlane.tag === tag);
}
const Swimlane = ({ data }: any) => {
  return (
    <>
      <div className="swimlane-body" style={{ width: data.width + "px" }}>
        <div className="swimlane-tag-square">
          <div className="swimlane-tag-text">{"" + data.tag}</div>
        </div>
      </div>
    </>
  );
};

export default Swimlane;
