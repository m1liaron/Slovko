import { StatusCodes } from "http-status-codes";
import type { AuthRequestHandler } from "@/libs/types/auth-request.type.js";

import { CardService } from "./card.service";
import { CardRepository } from "./card.repository";


const getAllCards: AuthRequestHandler = async (req, res) => {
  const { groupId } = req.params;
  const cards = await CardRepository.findByGroupIdWithImage(groupId);
  res.status(StatusCodes.OK).json(cards);
};

const getRepeatedCards: AuthRequestHandler = async (req, res) => {
  const { sectionId } = req.params;
  const data = await CardService.getRepeatedCards(sectionId);
  res.status(StatusCodes.OK).json(data);
};

const getCardsFromIds: AuthRequestHandler = async (req, res) => {
  const cards = await CardService.getCardsFromIds(req.body);
  res.status(StatusCodes.OK).json(cards);
};

const getAllStatusCards: AuthRequestHandler = async (req, res) => {
  const { status, groupId } = req.params;
  const cards = await CardService.getAllStatusCards(status as any, groupId);
  res.status(StatusCodes.OK).json(cards);
};

const updateCardsAfterReview: AuthRequestHandler = async (req, res) => {
  const updatedCards = await CardService.updateCardsAfterReview(req.body);
  res.status(StatusCodes.OK).json(updatedCards);
};

const addCard: AuthRequestHandler = async (req, res) => {
  const card = await CardService.addCard(req.body);
  res.status(StatusCodes.OK).json(card);
};

const addManyCards: AuthRequestHandler = async (req, res) => {
  const newCards = await CardService.addManyCards(req.body.cards);
  res.status(StatusCodes.CREATED).json(newCards);
};

const updateCard: AuthRequestHandler = async (req, res) => {
  const cardId = req.params.id;
  const { groupId } = req.body;
  const card = await CardService.updateCard(cardId, groupId, req.body);
  res.status(StatusCodes.OK).json(card);
};

const removeCard: AuthRequestHandler = async (req, res) => {
  const cardId = req.params.id;
  const id = await CardService.removeCard(cardId);
  res.status(StatusCodes.OK).json(id);
};

export {
  getAllCards,
  addCard,
  addManyCards,
  removeCard,
  updateCard,
  updateCardsAfterReview,
  getAllStatusCards,
  getRepeatedCards,
  getCardsFromIds,
};
