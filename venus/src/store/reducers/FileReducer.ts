import { RootStore } from "..";
import { Action, Actions } from "../../lib/actions";

const initialState: RootStore["file"] = {
  filename: "",
  id: "",
  serverFilename: "",
  size: 0,
  type: "",
  url: "",
  shouldPickName: false,
  files: [],
  expiration: new Date(),
};

export const fileReducer = (
  state = initialState,
  action: Action
): RootStore["file"] => {
  switch (action.type) {
    case Actions.SET_FILE:
      return {
        ...state,
        filename: action.payload.filename,
        url: action.payload.url,
        serverFilename: action.payload.serverFileName,
        shouldPickName: true,
        size: action.payload.size,
        id: action.payload.id,
        expiration: action.payload.expiration,
      };
    case Actions.ADD_FILE:
      return {
        ...state,
        files: state.files.concat(action.payload.file),
      };
    case Actions.RESET_FILE:
      return initialState;
    default:
      return state;
  }
};
