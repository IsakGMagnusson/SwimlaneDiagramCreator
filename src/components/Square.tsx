import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const Square = ({ data }: any) => {
  return (
    <>
      <div className="square-body">
        <div className="square-label-text">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ visibility: "hidden" }}
        id="source_right"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ visibility: "hidden" }}
        id="target_left"
      />
      <Handle
        type="source"
        position={Position.Top}
        style={{ visibility: "hidden" }}
        id="source_top"
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: "hidden" }}
        id="target_top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ visibility: "hidden" }}
        id="source_bottom"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ visibility: "hidden" }}
        id="target_bottom"
      />
    </>
  );
};

export default Square;
