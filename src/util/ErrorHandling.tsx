import { EdgeData, SquareData, ParsingErrorObject } from "../models/Model";

export function doesParseHaveError(
  brackets: string[],
  edgeDatas: EdgeData[],
  squareDatas: SquareData[]
): ParsingErrorObject {
  let hasError: boolean = false;
  let errorMessage: string = "";

  if (!areBracketsCorrect(brackets)) {
    hasError = true;
    errorMessage += "ERROR: Brackets not closed!\n";
  }

  if (!doAllSourceVariablesExist(edgeDatas, squareDatas)) {
    hasError = true;
    errorMessage += "ERROR: Source-Node does not exist!\n";
  }

  if (!doAllTargetVariablesExist(edgeDatas, squareDatas)) {
    hasError = true;
    errorMessage += "ERROR: Target-Node does not exist!\n";
  }

  return { hasError: hasError, errorMessage: errorMessage };
}

function doAllSourceVariablesExist(
  edgeDatas: EdgeData[],
  squares: SquareData[]
): boolean {
  for (let i = 0; i < edgeDatas.length; i++) {
    let isSourceFound = false;

    for (let j = 0; j < squares.length; j++) {
      if (squares[j].variable === edgeDatas[i].source) isSourceFound = true;
    }
    if (!isSourceFound) return false;
  }
  return true;
}

function doAllTargetVariablesExist(
  edgeDatas: EdgeData[],
  squares: SquareData[]
): boolean {
  for (let i = 0; i < edgeDatas.length; i++) {
    let isTargetFound = false;

    for (let j = 0; j < squares.length; j++) {
      if (squares[j].variable === edgeDatas[i].target) isTargetFound = true;
    }
    if (!isTargetFound) return false;
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
