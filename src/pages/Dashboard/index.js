import EmailEditor from "../../components/EmailEditor";
import { useRef, useState } from "react";
import defaultBlockList from "./defaultBlockList.json";
import Header from "./Header";
import { useEffect } from "react";
// TODO:
// 1.拷贝功能
// 2.图片block可以选择pexels的图片
// 3.图片上传
// 4.columns 添加可上传背景图片
// 5.spacer block

function Dashboard() {
  const emailEditorRef = useRef(null);
  const [emailData, setEmailData] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setTimeout(() => {
      setEmailData(defaultBlockList);
    }, 300);
  }, []);

  return (
    <div className="dashboard">
      <Header emailEditorEl={emailEditorRef} setLanguage={setLanguage} />
      <div className="dashboard-content">{emailData && <EmailEditor ref={emailEditorRef} defaultBlockList={emailData} language={language} />}</div>
    </div>
  );
}

export default Dashboard;
