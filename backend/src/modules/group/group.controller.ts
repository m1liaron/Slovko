import { GroupService } from "./group.service";
import { AuthRequestHandler } from "@/libs/types/auth-request.type";
import { StatusCodes } from "http-status-codes";

const getAllGroups: AuthRequestHandler = (req, res) => {
  const { sectionId } = req.params;
  const groups = GroupService.getAllGroups(sectionId);
  res.status(StatusCodes.OK).json(groups)
}
const addGroup: AuthRequestHandler = (req, res) => {
  const { sectionId } = req.params;
  const newGroup = GroupService.addGroup(req.body, sectionId);
  res.status(StatusCodes.OK).json(newGroup)
}
const removeGroup: AuthRequestHandler = (req, res) => {
  const { id } = req.params;
  const newGroup = GroupService.removeGroup(id);
  res.status(StatusCodes.OK).json(newGroup)
}
const getGroup: AuthRequestHandler = (req, res) => {
  const { id } = req.params;
  const newGroup = GroupService.getGroup(id);
  res.status(StatusCodes.OK).json(newGroup)
}
const updateGroup: AuthRequestHandler = (req, res) => {
  const { id, } = req.params;
  const newGroup = GroupService.updateGroup(id, req.body);
  res.status(StatusCodes.OK).json(newGroup)
}
const moveGroupToAnotherSection: AuthRequestHandler = (req, res) => {
  const { id, sectionId  } = req.params;
  const newGroup = GroupService.moveGroupToAnotherSection(id, sectionId);
  res.status(StatusCodes.OK).json(newGroup)
}

export {
  getAllGroups,
  addGroup,
  removeGroup,
  getGroup,
  updateGroup,
  moveGroupToAnotherSection
};
