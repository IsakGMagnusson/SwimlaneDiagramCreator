import { SourceDirections } from "../components/Square";
import { DiagramData } from "../models/Model";
import xmlFormat from "xml-formatter";

export function buildXML(diagramData: DiagramData): string {
  if (diagramData.hasParsingError) return "<error> Error: parse error </error>";

  diagramData = convertToDrawIOValues(diagramData);
  let xml: string =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    "<mxfile>" +
    "<diagram>" +
    "<mxGraphModel>" +
    "<root>" +
    '<mxCell id="0" />' +
    '<mxCell id="1" parent="0" />';

  diagramData.swimlanes.forEach((swimlane) => {
    xml +=
      `<mxCell id="${swimlane.tag}" value="${swimlane.tag}" style="swimlane;horizontal=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">` +
      ` <mxGeometry x="1050" y="${swimlane.yPosition}" width="${swimlane.width}" height="200" as="geometry" />` +
      " </mxCell>";
  });

  diagramData.squares.forEach((squareData) => {
    xml +=
      `<mxCell id=\"${squareData.variable}\" value=\"${squareData.label}\" style=\"rounded=1;whiteSpace=wrap;html=1;\" vertex=\"1\" parent=\"${squareData.parent}\">` +
      `<mxGeometry x=\"${squareData.xPosition}\" y=\"70\" width=\"120\" height=\"60\" as=\"geometry\" /> ` +
      "</mxCell>";
  });

  diagramData.edges.forEach((edgeData) => {
    xml +=
      `<mxCell id=\"${edgeData.id}\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;${edgeData.sourceHandle};exitDx=0;exitDy=0;\" edge=\"1\" source=\"${edgeData.source}\" target=\"${edgeData.target}\" parent=\"1\">` +
      `<mxGeometry relative=\"1\" as=\"geometry\" />` +
      "</mxCell>";
  });

  xml += "</root>" + "</mxGraphModel>" + "</diagram>" + "</mxfile>";

  return xmlFormat(xml);
}

function convertToDrawIOValues(diagramData: DiagramData): DiagramData {
  const swimlaneheight_difference = 50;
  let swimlaneCounter = 0;
  diagramData.swimlanes.forEach((swimlane) => {
    swimlane.yPosition += swimlaneCounter * swimlaneheight_difference;
    swimlaneCounter++;
  });

  //exitX=0.5, exitY=0.25 up
  //exitX=0.5, exitY=0.5 right
  //exitX=0, exitY=0.5 left
  //exitX=0.5, exitY=1 down
  diagramData.edges.forEach((edge) => {
    switch (edge.sourceHandle) {
      case SourceDirections.TOP:
        edge.sourceHandle = "exitX=0.5, exitY=0.25";
        break;
      case SourceDirections.RIGHT:
        edge.sourceHandle = "exitX=0.5, exitY=0.5";
        break;
      case SourceDirections.BOTTOM:
        edge.sourceHandle = "exitX=0.5, exitY=1";
        break;
      default:
        edge.sourceHandle = "exitX=0.5, exitY=0.25";
    }
  });

  return {
    swimlanes: diagramData.swimlanes,
    squares: diagramData.squares,
    edges: diagramData.edges,
    hasParsingError: false,
  };
}
