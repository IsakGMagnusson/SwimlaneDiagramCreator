import React, { useEffect, useState } from "react";
import ReactFlow, { MarkerType, useEdgesState, useNodesState } from "reactflow";

import Swimlane, { SWIMLANE_HEIGHT } from "../components/Swimlane";
import xmlFormat from "xml-formatter";

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
import { useErrorHandling } from "../hooks/useErrorHandling";
import { useXmlBuilder } from "../hooks/useXmlBuilder";

const startString: string =
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
  "variable4-->variable5";

const nodeTypes = {
  swimlane: Swimlane,
  square: Square,
};

export default function MainPage() {
  const [nodes, setNodes] = useNodesState<DiagramObjects[]>([]);
  const [edges, setEdges] = useEdgesState([]);

  const [xml, buildXml] = useXmlBuilder();

  const [displayState, setDisplayState] = useState(false);
  const [errorObject, checkForErrors] = useErrorHandling();

  const [textareaContent, setTextareaContent] = useState(startString);

  function textToData(): DiagramData {
    setDisplayState(false);
    let lines: string[] = textareaContent.split(/\r?\n/);
    let swimlaneTag = "";
    let squareXPosition = SQUARE_STARTING_X;
    const arrowSymbol = "-->";

    let brackets: string[] = [];
    let alreadyAddedSwimlanes: string[] = [];

    let swimlaneDatas: SwimlaneData[] = [];
    let squareDatas: SquareData[] = [];
    let edgeInputData: EdgeData[] = [];
    lines.forEach((line: string) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "}") brackets.push("}");
        if (line[i] === "{") brackets.push("{");
      }

      //Swimlane
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
        //Square
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

        //Arrow
      } else if (line.includes(arrowSymbol)) {
        let from: string = line.substring(0, line.indexOf(arrowSymbol));
        let to: string = line.substring(
          line.indexOf(arrowSymbol) + arrowSymbol.length,
          line.length
        );

        let sourcePosition = findSquarePositionFromVariable(
          swimlaneDatas,
          squareDatas,
          from
        );

        let targetPosition = findSquarePositionFromVariable(
          swimlaneDatas,
          squareDatas,
          to
        );

        edgeInputData.push({
          id: from.concat(to),
          source: from,
          target: to,
          sourceHandle: findEdgeHandleSource(sourcePosition, targetPosition),
          targetHandle: findEdgeHandleTarget(sourcePosition, targetPosition),
        });
      }
    });

    swimlaneDatas.forEach(
      (swimlane) => (swimlane.width = SQUARE_SIZE + squareXPosition)
    );

    checkForErrors(brackets, edgeInputData, squareDatas);

    return {
      swimlanes: swimlaneDatas,
      squares: squareDatas,
      edges: edgeInputData,
      hasParsingError: errorObject?.hasError!,
    };
  }

  function dataToDiagram(diagramData: DiagramData) {
    if (diagramData.hasParsingError) return;

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
      edges.push({
        id: edge.id,
        type: "smoothstep",
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
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

  useEffect(() => {
    dataToDiagram(textToData());
    buildXml(textToData());
  }, [errorObject?.hasError]);

  function toggleDisplay() {
    buildXml(textToData());
    setDisplayState(!displayState);
  }

  return (
    <div className="mainpage">
      <div className="sidebar">
        <textarea
          className="textarea"
          onChange={(e) => setTextareaContent(e.target.value)}
          onKeyUp={() => dataToDiagram(textToData())}
        >
          {textareaContent}
        </textarea>
        <button className="export-button" onClick={toggleDisplay}>
          Toggle display
        </button>
      </div>

      <div className="reactflow-container">
        {displayState ? (
          <div className="display-xml">
            <div className="display-xml-info">Draw.io xml-format:</div>
            <textarea readOnly className="display-xml-textarea">
              {xmlFormat(xml)}
            </textarea>
          </div>
        ) : (
          <>
            {errorObject?.hasError ? (
              <div className="errormessage-container">
                <p className="errormessage-text-header">Errors</p>
                {errorObject.errorMessages.map((msg) => (
                  <p className="errormessage-text">{msg}</p>
                ))}
              </div>
            ) : (
              <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                fitView
              ></ReactFlow>
            )}
          </>
        )}
      </div>
    </div>
  );
}
