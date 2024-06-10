// Models for grouping objects from text
export interface DiagramData {
  swimlanes: SwimlaneData[];
  squares: SquareData[];
  edges: EdgeData[];
  hasParsingError: boolean;
}
export interface SwimlaneData {
  type: string;
  tag: string;
  yPosition: number;
  width: number;
}

export interface SquareData {
  variable: string;
  label: string;
  xPosition: number;
  parent: string;
  type: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

//Models for generating ReactFlow objects
export interface DiagramObjects extends Partial<Node> {}

export interface SwimlaneObject extends DiagramObjects {
  id: string;
  type: string;
  data: object;
  position: XYPosition;
}

export interface SquareObject extends DiagramObjects {
  id: string;
  type: string;
  data: object;
  position: XYPosition;
  parentId: string;
  isConnectable: object;
}

interface XYPosition {
  x: number;
  y: number;
}

//Error
export interface ParsingErrorObject {
  hasError: boolean;
  errorMessages?: string[];
}
