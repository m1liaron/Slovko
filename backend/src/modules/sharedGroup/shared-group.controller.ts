import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthRequest } from "@/libs/types/types";

import type {
  CopySharedGroupBody,
  CreateSharedGroupBody,
  SharedGroupsQuery,
} from "./libs/types";
import { SharedGroupService } from "./shared-group.service.js";

const createSharedGroup = async (req: AuthRequest, res: Response) => {
  const body = req.body as CreateSharedGroupBody;
  const sharedGroup = await SharedGroupService.createSharedGroup(
    req.user.id,
    body,
  );
  res.status(StatusCodes.OK).json(sharedGroup);
};

const getAllSharedGroups = async (
  req: AuthRequest<SharedGroupsQuery>,
  res: Response,
) => {
  const { page = "0", limit = "10" } = req.query as SharedGroupsQuery;
  const data = await SharedGroupService.getAllSharedGroups(page, limit);
  res.status(StatusCodes.OK).json(data);
};

const getSharedGroup = async (req: AuthRequest, res: Response) => {
  const sharedGroup = await SharedGroupService.getSharedGroup(
    req.params.sharedGroupId
  );
  res.status(StatusCodes.OK).json(sharedGroup);
};

const removeSharedGroup = async (req: AuthRequest, res: Response) => {
  const sharedGroupId = await SharedGroupService.removeSharedGroup(
    req.user.id,
    req.params.sharedGroupId,
  );
  res.status(StatusCodes.OK).json(sharedGroupId);
};

const copySharedGroup = async (req: AuthRequest, res: Response) => {
  const body = req.body as CopySharedGroupBody;
  const newGroup = await SharedGroupService.copySharedGroup(
    body,
    req.params.sharedGroupId,
  );
  res.status(StatusCodes.OK).json(newGroup);
};

export {
  createSharedGroup,
  getAllSharedGroups,
  getSharedGroup,
  copySharedGroup,
  removeSharedGroup,
};
