import { addCard, updateCard, getCards, removeCard, updateCardsAfterLearn, getRepeatedCardsFromIds } from "../../../redux/cardReducer/cardThunk";

/**
 * A mapping from thunk “base” type string to the asyncThunk creator itself.
 */
const thunkRegistry: Record<string, (...args: any[]) => any> = {
    [addCard.typePrefix]: addCard,
    [updateCard.typePrefix]: updateCard,
    [getCards.typePrefix]: getCards,
    [removeCard.typePrefix]: removeCard,
    [updateCardsAfterLearn.typePrefix]: updateCardsAfterLearn,
    [getRepeatedCardsFromIds.typePrefix]: getRepeatedCardsFromIds,
};

export { thunkRegistry };