import EmailEditor from "../../components/EmailEditor";
import { useCallback, useRef } from "react";
import defaultBlockList from "./defaultBlockList.json";
import Header from "./Header";
// TODO:
// 1.拷贝功能
// 2.图片block可以选择pexels的图片
// 3.图片上传
// 4.columns 添加可上传背景图片
// 5.spacer block

function Dashboard() {
  const emailEditorRef = useRef(null);
  return (
    <div className="flex flex-col h-full">
      <Header emailEditorEl={emailEditorRef} />
      <div className="flex-1 overflow-auto">
        <EmailEditor ref={emailEditorRef} defaultBlockList={defaultBlockList} />
      </div>
    </div>
  );
}

export default Dashboard;
