// Models for grouping objects from text
export interface DiagramInputData {
  swimlanes: SwimlaneInputData[];
  edges: EdgeInputData[];
}
export interface SwimlaneInputData {
  tag: string;
  squares: squareInputData[];
}

export interface squareInputData {
  variable: string;
  label: string;
}

export interface EdgeInputData {
  source: string;
  target: string;
}

// Models for grouping objects with data
export interface DiagramData {
  swimlaneDatas: SwimlaneWithSquaresData[];
  edgeDatas: EdgeData[];
}

export interface SwimlaneWithSquaresData {
  swimlaneData: SwimlaneData;
  squareDatas: SquareData[];
}

export interface SwimlaneData {
  type: string;
  tag: string;
  yPosition: number;
  width: number;
}

export interface SquareData {
  type: string;
  variable: string;
  label: string;
  xPosition: number;
  parentId: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
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
