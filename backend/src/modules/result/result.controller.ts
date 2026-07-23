import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { type AuthRequest } from "@/libs/types/auth-request.type.js";

import { type ResultsQuery, type SaveResultsRequest } from "./libs/types";
import { resultService } from "./result.service.js";

const getResultsDetails = async (req: AuthRequest, res: Response) => {
  const results = await resultService.getResultsDetails(req.user.id);
  res.status(StatusCodes.OK).json(results);
};

const getResultsStatistics = async (req: AuthRequest, res: Response) => {
  const stats = await resultService.getResultsStatistics(req.user.id);
  res.status(StatusCodes.OK).json(stats);
};

const getResults = async (req: AuthRequest<ResultsQuery>, res: Response) => {
  const { month, year, page = "0", limit = "10" } = req.query as ResultsQuery;
  const data = await resultService.getResults(
    req.user.id,
    month,
    year,
    page,
    limit,
  );
  res.status(StatusCodes.OK).json(data);
};

const getResultDetails = async (req: AuthRequest, res: Response) => {
  const { resultId } = req.params;
  const result = await resultService.getResultDetails(req.user.id, resultId);
  res.status(StatusCodes.OK).json(result);
};

const saveResults = async (
  req: AuthRequest<SaveResultsRequest>,
  res: Response,
) => {
  const result = await resultService.saveResults(req.user.id, req.body);
  res.status(StatusCodes.OK).json(result);
};

export {
  saveResults,
  getResults,
  getResultDetails,
  getResultsDetails,
  getResultsStatistics,
};
