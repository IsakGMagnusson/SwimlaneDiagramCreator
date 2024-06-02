import React, { useEffect, useState } from "react";
import ReactFlow, { MarkerType, useEdgesState, useNodesState } from "reactflow";

import Swimlane, { SWIMLANE_HEIGHT } from "../components/Swimlane";

import "reactflow/dist/style.css";
import {
  DiagramObjects,
  DiagramData,
  SwimlaneData,
  SquareData,
  EdgeData,
} from "../models/Model";

import Square, {
  SQUARE_SIZE,
  SQUARE_STARTING_X,
  findEdgeHandleSource,
  findEdgeHandleTarget,
  findSquarePositionFromVariable,
  isSquareSlotOccupied,
} from "../components/Square";

const nodeTypes = {
  swimlane: Swimlane,
  square: Square,
};

export default function MainPage() {
  const [nodes, setNodes] = useNodesState<DiagramObjects[]>([]);
  const [edges, setEdges] = useEdgesState([]);

  const [isThereError, setIsThereError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [textareaContent, setTextareaContent] = useState(
    "Swimlane1{\n" +
      " variable1:name1\n" +
      "}\n" +
      "Swimlane2{\n" +
      " variable2:name2\n" +
      " variable3:name3\n" +
      " variable4:name4\n" +
      "}\n" +
      "Swimlane1{\n" +
      " variable5:name5\n" +
      "} \n" +
      "\n" +
      "variable1-->variable2\n" +
      "variable2-->variable3\n" +
      "variable3-->variable4\n" +
      "variable3-->variable5\n" +
      "variable4-->variable5\n"
  );

  useEffect(() => {
    dataToDiagram(textToData());
  }, []);

  function textToData(): DiagramData {
    let lines: string[] = textareaContent.split(/\r?\n/);

    let swimlaneTag = "";

    let brackets: string[] = [];

    let squareXPosition = SQUARE_STARTING_X;
    let squareDatas: SquareData[] = [];

    let alreadyAddedSwimlanes: string[] = [];
    let swimlaneDatas: SwimlaneData[] = [];
    lines.forEach((line: string) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "}") brackets.push("}");
        if (line[i] === "{") brackets.push("{");
      }

      if (line.trim().at(-1) === "{") {
        swimlaneTag = line.substring(0, line.trim().length - 1).trim();
        if (!alreadyAddedSwimlanes.includes(swimlaneTag)) {
          let swimlaneTextGroup: SwimlaneData = {
            type: "swimlane",
            yPosition: SWIMLANE_HEIGHT * alreadyAddedSwimlanes.length,
            tag: swimlaneTag,
            width: 0,
          };
          swimlaneDatas.push(swimlaneTextGroup);
          alreadyAddedSwimlanes.push(swimlaneTag);
        }
      } else if (brackets.at(-1) === "{" && line.trim().length > 0) {
        if (isSquareSlotOccupied(squareDatas, squareXPosition, swimlaneTag))
          squareXPosition += SQUARE_SIZE;
        let words: string[] = line.split(":".trim());

        squareDatas.push({
          type: "square",
          variable: words[0].trim(),
          label: words[1],
          xPosition: squareXPosition,
          parent: swimlaneTag,
        });
      }
    });

    swimlaneDatas.forEach(
      (swimlane) => (swimlane.width = SQUARE_SIZE + squareXPosition)
    );

    let edgeInputaData: EdgeData[] = [];
    lines.forEach((line) => {
      if (line.includes("-->")) {
        let from: string = line.substring(0, line.indexOf("-->"));
        let to: string = line.substring(line.indexOf("-->") + 3, line.length);

        if (!doesEdgeVariablesExist(squareDatas, from, to)) return;

        edgeInputaData.push({ id: from.concat(to), source: from, target: to });
      }
    });
    console.log(brackets);

    setIsThereError(isThereParsingError(brackets));
    console.log(isThereError);
    return {
      swimlanes: swimlaneDatas,
      squares: squareDatas,
      edges: edgeInputaData,
    };
  }

  function doesEdgeVariablesExist(
    squares: SquareData[],
    from: string,
    to: string
  ): boolean {
    return (
      squares.some((square) => square.variable === from) &&
      squares.some((square) => square.variable === to)
    );
  }

  function dataToDiagram(diagramData: DiagramData) {
    let swimlaneObjects: any = [];

    diagramData.swimlanes.forEach((swimlane) => {
      swimlaneObjects.push({
        id: swimlane.tag,
        type: swimlane.type,
        data: {
          tag: swimlane.tag,
          width: swimlane.width,
        },
        position: { x: 0, y: swimlane.yPosition },
      });
    });

    diagramData.squares.forEach((square) => {
      swimlaneObjects.push({
        id: square.variable,
        type: square.type,
        data: { label: square.label },
        position: { x: square.xPosition, y: 50 },
        parentId: square.parent,
      });
    });

    setNodes(swimlaneObjects);

    let edges: any[] = [];
    diagramData.edges.forEach((edge) => {
      let sourcePosition = findSquarePositionFromVariable(
        diagramData.swimlanes,
        diagramData.squares,
        edge.source
      );

      let targetPosition = findSquarePositionFromVariable(
        diagramData.swimlanes,
        diagramData.squares,
        edge.target
      );

      edges.push({
        id: edge.id,
        type: "smoothstep",
        source: edge.source,
        target: edge.target,
        sourceHandle: findEdgeHandleSource(sourcePosition!, targetPosition!),
        targetHandle: findEdgeHandleTarget(sourcePosition!, targetPosition!),
        style: { stroke: "#fff" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#fff",
        },
      });
    });

    setEdges(edges);
  }

  function isThereParsingError(brackets: string[]): boolean {
    if (!areBracketsCorrect(brackets)) {
      setErrorMsg("ERROR: Brackets not closed");
      return true;
    }
    return false;
  }

  function areBracketsCorrect(brackets: string[]): boolean {
    if (brackets.length % 2 !== 0) return false;

    for (let i = 0; i < brackets.length - 1; i++) {
      if (i % 2 === 0 && brackets[i] !== "{") return false;
      if (i % 2 !== 0 && brackets[i] !== "}") return false;
    }
    return true;
  }

  return (
    <div className="mainpage">
      <textarea
        className="textarea"
        onChange={(e) => setTextareaContent(e.target.value)}
        onKeyUp={() => dataToDiagram(textToData())}
      >
        {textareaContent}
      </textarea>

      <div className="reactflow-container">
        {isThereError ? (
          <div className="errormessage-text"> {errorMsg} </div>
        ) : (
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
          ></ReactFlow>
        )}
      </div>
    </div>
  );
}
