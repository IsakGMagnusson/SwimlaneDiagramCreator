import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MarkerType,
  MiniMap,
  XYPosition,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import Swimlane from "../components/Swimlane";

import "reactflow/dist/style.css";
import {
  DiagramObjects,
  SquareData,
  SwimlaneData,
  SwimlaneWithSquaresData,
  SwimlaneObject,
  DiagramInputData,
  SwimlaneInputData,
  DiagramData,
  squareInputData,
  EdgeData,
  EdgeInputData,
  SquareObject,
} from "../models/Model";
import Square from "../components/Square";

const nodeTypes = {
  swimlane: Swimlane,
  square: Square,
};

const SWIMLANE_HEIGHT = 150;
const SQUARE_WIDTH = 100;
const SQUARE_SPACING = 50;
const NODE_STARTING_X = 40;
const SQUARE_SIZE = SQUARE_WIDTH + SQUARE_SPACING;

export default function MainPage() {
  const [nodes, setNodes] = useNodesState<DiagramObjects[]>([]);
  const [edges, setEdges] = useEdgesState([]);

  function textToObjectData(): DiagramInputData {
    let lines: string[] = textareaContent.split(/\r?\n/);

    let swimlaneInputDatas: SwimlaneInputData[] = [];
    let squaresInSwimlane: squareInputData[] = [];
    let edgeInputaData: EdgeInputData[] = [];
    let alreadyAddedSwimlanes: string[] = [];

    lines.forEach((line) => {
      if (!line.endsWith(";")) return;
      line = line.substring(0, line.length - 1);

      let words: string[] = line.split(":".trim());
      //if arrow
      if (line.includes("-->")) {
        let from: string = line.substring(0, line.indexOf("-->"));
        let to: string = line.substring(line.indexOf("-->") + 3, line.length);
        if (!doesEdgeVariablesExist(swimlaneInputDatas, from, to)) return;
        edgeInputaData.push({ source: from, target: to });
      }
      //if swimlane
      else if (line[0] != " " && line.trim().length > 0) {
        if (alreadyAddedSwimlanes.includes(words[0])) {
          squaresInSwimlane = swimlaneInputDatas.find(
            (swimlane) => swimlane.tag === words[0]
          )!.squares;
          console.log("aaaa");
        } else {
          squaresInSwimlane = [];
          let swimlaneTextGroup: SwimlaneInputData = {
            tag: words[0],
            squares: squaresInSwimlane,
          };
          swimlaneInputDatas.push(swimlaneTextGroup);
          alreadyAddedSwimlanes.push(words[0]);
        }

        //if square
      } else if (line[0] == " " && line.trim().length > 0) {
        squaresInSwimlane.push({ variable: words[0].trim(), label: words[1] });
      }
    });

    return { swimlanes: swimlaneInputDatas, edges: edgeInputaData };
  }

  function doesEdgeVariablesExist(
    swimlaneInputDatas: SwimlaneInputData[],
    from: string,
    to: string
  ): boolean {
    let fromExists: boolean = false;
    let toExists: boolean = false;
    swimlaneInputDatas.forEach((swimlaneInputData) =>
      swimlaneInputData.squares.forEach((square) => {
        if (square.variable == from) fromExists = true;
        if (square.variable == to) toExists = true;
      })
    );

    return fromExists && toExists;
  }

  function findLongestSwimlane(swimlanes: SwimlaneInputData[]): number {
    let squareCounter = 0;

    swimlanes.forEach((swimlane) => {
      let xPositions: number[] = [];
      swimlane.squares.forEach(() => {
        if (
          xPositions.some(
            (xPosition) =>
              NODE_STARTING_X + SQUARE_SIZE * squareCounter == xPosition
          )
        )
          squareCounter++;

        xPositions.push(NODE_STARTING_X + SQUARE_SIZE * squareCounter);
      });
    });

    return SQUARE_SIZE + NODE_STARTING_X + SQUARE_SIZE * squareCounter;
  }

  function isSwimlaneAdded(
    swimlanes: SwimlaneWithSquaresData[],
    tag: string
  ): boolean {
    return swimlanes.some((swimlane) => swimlane.swimlaneData.tag === tag);
  }
  function findSwimlaneFromTag(
    swimlanes: SwimlaneWithSquaresData[],
    tag: string
  ): SwimlaneData | undefined {
    return swimlanes.find((swimlane) => swimlane.swimlaneData.tag === tag)
      ?.swimlaneData;
  }

  function refineObjectData(): DiagramData {
    let inputData: DiagramInputData = textToObjectData();
    let squareCounter = 0;
    let swimlaneCounter = 0;
    let swimlaneDatas: SwimlaneWithSquaresData[] = [];
    let longestSwimlane = findLongestSwimlane(inputData.swimlanes);

    inputData.swimlanes.forEach((swimlane) => {
      let swimlaneData = {
        type: "swimlane",
        tag: swimlane.tag,
        yPosition: SWIMLANE_HEIGHT * swimlaneCounter,
        width: longestSwimlane,
      };

      swimlaneCounter++;

      let squareDatas: SquareData[] = [];
      swimlane.squares.forEach((square) => {
        if (
          squareDatas.some(
            (squareData) =>
              squareData.xPosition ==
              NODE_STARTING_X + SQUARE_SIZE * squareCounter
          )
        )
          squareCounter++;

        squareDatas.push({
          type: "square",
          parentId: swimlane.tag,
          variable: square.variable.trim(),
          label: square.label,
          xPosition: NODE_STARTING_X + SQUARE_SIZE * squareCounter,
        });
      });

      swimlaneDatas.push({
        swimlaneData: swimlaneData,
        squareDatas: squareDatas,
      });
    });

    let edgeDatas: EdgeData[] = [];
    inputData.edges.forEach((edge) => {
      edgeDatas.push({
        id: edge.source.concat(edge.target),
        source: edge.source,
        target: edge.target,
      });
    });

    return { swimlaneDatas: swimlaneDatas, edgeDatas: edgeDatas };
  }

  function dataToDiagram() {
    let diagramData: DiagramData = refineObjectData();
    let swimlaneObjects: any = [];
    diagramData.swimlaneDatas.forEach(
      (swimlaneDataGroup: SwimlaneWithSquaresData) => {
        // Swimlanes
        swimlaneObjects.push({
          id: swimlaneDataGroup.swimlaneData.tag,
          type: swimlaneDataGroup.swimlaneData.type,
          data: {
            tag: swimlaneDataGroup.swimlaneData.tag,
            width: swimlaneDataGroup.swimlaneData.width,
          },
          position: { x: 0, y: swimlaneDataGroup.swimlaneData.yPosition },
        });

        // Squares
        swimlaneDataGroup.squareDatas.forEach((squareData) => {
          swimlaneObjects.push({
            id: squareData.variable,
            type: squareData.type,
            data: { label: squareData.label },
            position: { x: squareData.xPosition, y: 50 },
            parentId: squareData.parentId,
          });
        });
      }
    );

    let edges: any[] = [];

    diagramData.edgeDatas.forEach((edge) => {
      let sourcePosition = findSquarePositionFromVariable(
        diagramData.swimlaneDatas,
        edge.source
      );

      let targetPosition = findSquarePositionFromVariable(
        diagramData.swimlaneDatas,
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
    setNodes(swimlaneObjects);
  }

  function findSquarePositionFromVariable(
    swimlaneDatas: SwimlaneWithSquaresData[],
    variable: string
  ): XYPosition | undefined {
    let squarePosition: XYPosition = undefined!;
    swimlaneDatas.forEach((swimlaneData) =>
      swimlaneData.squareDatas.forEach((squareData) => {
        if (squareData.variable === variable) {
          squarePosition = {
            x: squareData.xPosition,
            y: swimlaneData.swimlaneData.yPosition,
          };
        }
      })
    );

    return squarePosition;
  }

  function findEdgeHandleSource(from: XYPosition, to: XYPosition): string {
    if (from.x == to.x && from.y > to.y) return "source_top";
    if (from.x == to.x && from.y < to.y) return "source_bottom";
    if (from.x < to.x) return "source_right";

    return "source_right";
  }

  function findEdgeHandleTarget(from: XYPosition, to: XYPosition): string {
    if (from.x == to.x && from.y > to.y) return "target_bottom";
    if (from.x == to.x && from.y < to.y) return "target_top";
    if (from.x < to.x) return "target_left";

    return "target_left";
  }

  const [textareaContent, setTextareaContent] = useState(
    "Swimlane1;\n" +
      " variable1:name1;\n" +
      "Swimlane2;\n" +
      " variable2:name2;\n" +
      " variable3:name3;\n" +
      " variable4:name4;\n" +
      "Swimlane1;\n" +
      " variable5:name5;\n" +
      "\n" +
      "variable1-->variable2;\n" +
      "variable2-->variable3;\n" +
      "variable3-->variable4;\n" +
      "variable3-->variable5;\n" +
      "variable4-->variable5;\n"
  );

  useEffect(() => {
    dataToDiagram();
  }, []);

  const registerKey = () => {
    dataToDiagram();
  };

  return (
    <div className="mainpage">
      <textarea
        className="textarea"
        onChange={(e) => setTextareaContent(e.target.value)}
        onKeyUp={registerKey}
      >
        {textareaContent}
      </textarea>
      <div className="reactflow-container">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
        ></ReactFlow>
      </div>
    </div>
  );
}
