import useTranslation from "../translation";
import getBlockConfigsList from "./getBlockConfigsList";
import getColumnsSettings from "./getColumnsSettings";
import getColumnConfigFunc from "./getColumnConfigFunc";

const useDataSource = () => {
  const { t } = useTranslation();
  const blockConfigsList = getBlockConfigsList(t);
  const columnsSetting = getColumnsSettings(t);
  const getColumnConfig = getColumnConfigFunc(t);

  return {
    blockConfigsList,
    columnsSetting,
    getColumnConfig,
  };
};

export default useDataSource;
