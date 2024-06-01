import React, { memo } from "react";

const Swimlane = ({data}: any) => {
  return (
    <>
      <div className="swimlane-body" style={{width : data.width+"px"}}>
        <div className="swimlane-tag-square"> 
          <div className="swimlane-tag-text">{""+data.tag}</div>
        </div>
      </div>
    </>
  );
};

export default Swimlane;
