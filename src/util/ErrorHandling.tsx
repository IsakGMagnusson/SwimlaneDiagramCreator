import { EdgeData, SquareData, ParsingErrorObject } from "../models/Model";

export function doesParseHaveError(
  brackets: string[],
  edgeDatas: EdgeData[],
  squareDatas: SquareData[]
): ParsingErrorObject {
  let errorMessages: string[] = [];

  if (!areBracketsCorrect(brackets)) {
    errorMessages.push("Brackets not closed");
  }

  if (!doAllSourceVariablesExist(edgeDatas, squareDatas)) {
    errorMessages.push("Source-Node does not exist");
  }

  if (!doAllTargetVariablesExist(edgeDatas, squareDatas)) {
    errorMessages.push("Target-Node does not exist");
  }

  return { hasError: errorMessages.length > 0, errorMessages: errorMessages };
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
