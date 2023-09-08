const Header = (props) => {
  const { emailEditorEl } = props;

  const exportHTML = () => {
    const html = emailEditorEl.current.exportHtml();
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.download = "email.html";
    a.href = URL.createObjectURL(blob);
    a.click();
  };
  return (
    <div className="w-full bg-slate-600 flex justify-between items-center border-none px-6 py-3">
      <div className="text-white text-4xl font-bold font-sans">Email Editor</div>
      <button className="px-8 py-3 text-white text-sm rounded-full font-semibold bg-blue-500 hover:bg-blue-600 transition-all" onClick={exportHTML}>
        导出html
      </button>
    </div>
  );
};

export default Header;
