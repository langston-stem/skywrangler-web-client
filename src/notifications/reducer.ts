import React from "react";
import { Action, ActionType } from "./actions";
import { Notification } from "./notification";

export type State = ReadonlyArray<Notification>;

export type Dispatch = React.Dispatch<Action>;

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.Add:
      return state.concat([action.notification]);
    case ActionType.Remove:
      return state.filter((n) => n.id !== action.id);
    default:
      return state;
  }
};

export default reducer;
