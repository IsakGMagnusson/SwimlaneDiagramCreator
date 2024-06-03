import { DiagramData } from "../models/Model";

export function buildXML(diagramData: DiagramData) {
  if (diagramData.hasParsingError) {
    alert("Parse error");
    return;
  }

  diagramData = measurementConvert(diagramData);
  let xml: string = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += "<mxfile>";
  xml += "<diagram>";
  xml += "<mxGraphModel>";
  xml += "<root>";
  xml += '<mxCell id="0" />';
  xml += '<mxCell id="1" parent="0" />';

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

  xml += "</root>";
  xml += "</mxGraphModel>";
  xml += "</diagram>";
  xml += "</mxfile>";

  console.log(xml);
}

function measurementConvert(diagramData: DiagramData): DiagramData {
  const swimlaneheight_difference = 50;
  let swimlaneCounter = 0;
  diagramData.swimlanes.forEach((swimlane) => {
    swimlane.yPosition += swimlaneCounter * swimlaneheight_difference;
    swimlaneCounter++;
  });

  return {
    swimlanes: diagramData.swimlanes,
    squares: diagramData.squares,
    edges: diagramData.edges,
    hasParsingError: false,
  };
}
