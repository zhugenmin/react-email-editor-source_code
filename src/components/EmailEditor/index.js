import { useReducer, forwardRef, useImperativeHandle } from "react";
import {
  GlobalContext,
  reducer,
  setBlockList,
  setActionType,
  setPreviewMode,
  setCurrentItem,
  setBodySettings,
  setIsDragStart,
  setSelectionRange,
  setTextRange,
  defaultState,
} from "./reducers";
import dataToHtml from "./utils/dataToHTML";
import Main from "./components/Main";
import "./assets/App.css";

const EmailEditor = forwardRef(({ defaultBlockList }, ref) => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    blockList: defaultBlockList ? defaultBlockList : defaultState.blockList,
  });

  useImperativeHandle(ref, () => ({
    blockList: state.blockList,
    actionType: state.actionType,
    exportHtml: () => dataToHtml({ bodySettings: state.bodySettings, blockList: state.blockList }),
  }));

  return (
    <GlobalContext.Provider
      value={{
        blockList: state.blockList,
        actionType: state.actionType,
        previewMode: state.previewMode,
        currentItem: state.currentItem,
        bodySettings: state.bodySettings,
        isDragStart: state.isDragStart,
        selectionRange: state.selectionRange,
        textRange: state.textRange,
        setIsDragStart: (isDragStart) => {
          dispatch(setIsDragStart(isDragStart));
        },
        setBodySettings: (bodySettings, actionType) => {
          actionType && dispatch(setActionType(actionType));
          dispatch(setBodySettings(bodySettings));
        },
        setBlockList: (blockList, actionType) => {
          actionType && dispatch(setActionType(actionType));
          dispatch(setBlockList(blockList));
        },
        setPreviewMode: (previewMode) => {
          dispatch(setPreviewMode(previewMode));
        },
        setCurrentItem: (currentItem) => {
          dispatch(setCurrentItem(currentItem));
        },
        setSelectionRange: (selectionRange) => {
          dispatch(setSelectionRange(selectionRange));
        },
        setTextRange: (textRange) => {
          dispatch(setTextRange(textRange));
        },
        setActionType: (actionType) => {
          dispatch(setActionType(actionType));
        },
      }}
    >
      <Main />
    </GlobalContext.Provider>
  );
});

export default EmailEditor;
