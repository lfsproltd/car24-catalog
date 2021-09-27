import { createReducer } from "reduxsauce";
import Types from "./types";

export const INITIAL_STATE = {
    quack: null
};

export const quack = (state = INITIAL_STATE) => {
    return { ...state, isLoading: true};
};

export const HANDLERS = {
    [Types.QUACK]: quack

};

export default createReducer(INITIAL_STATE, HANDLERS);
