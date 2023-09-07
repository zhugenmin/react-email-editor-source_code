import { useCallback, useContext, useMemo } from "react";
import { GlobalContext } from "../reducers";
import { deepClone } from "./helpers";

const useSection = () => {
  const { selectionRange } = useContext(GlobalContext);
  const getSelectionNode = (node, tagName) => {
    if (!node) return null;
    if (node.classList?.contains("text-content_editable")) return null;

    if (node && node.tagName?.toLocaleLowerCase() === tagName) {
      return node;
    }
    return getSelectionNode(node.parentNode, tagName);
  };

  const getSectionStyle = useCallback((node, styleName) => {
    if (!node) return null;
    if (node.classList?.contains("text-content_editable")) return null;
    if (node && node.style?.[styleName]) return node.style[styleName];
    return getSectionStyle(node.parentNode, styleName);
  }, []);

  return { getSelectionNode, getSectionStyle };
};

export default useSection;
