import { EdgeData, SquareData, ParsingErrorObject } from "../models/Model";

export function doesParseHaveError(
  brackets: string[],
  edgeDatas: EdgeData[],
  squareDatas: SquareData[]
): ParsingErrorObject {
  if (!areBracketsCorrect(brackets))
    return {
      hasError: true,
      errorMessage: "ERROR: Brackets not closed!",
    };

  if (!doAllEdgeVariablesExist(edgeDatas, squareDatas))
    return {
      hasError: true,
      errorMessage: "ERROR: Edge square does not exist!",
    };

  return { hasError: false };
}

function doAllEdgeVariablesExist(
  edgeDatas: EdgeData[],
  squares: SquareData[]
): boolean {
  for (let i = 0; i < edgeDatas.length; i++) {
    let isSourceFound = false;
    let isTargetFound = false;

    for (let j = 0; j < squares.length; j++) {
      if (squares[j].variable === edgeDatas[i].source) isSourceFound = true;
      if (squares[j].variable === edgeDatas[i].target) isTargetFound = true;
    }
    if (!isSourceFound || !isTargetFound) return false;
  }
  return true;
}

function areBracketsCorrect(brackets: string[]): boolean {
  if (brackets.length % 2 !== 0) return false;

  for (let i = 0; i < brackets.length - 1; i++) {
    if (i % 2 === 0 && brackets[i] !== "{") return false;
    if (i % 2 !== 0 && brackets[i] !== "}") return false;
  }
  return true;
}
