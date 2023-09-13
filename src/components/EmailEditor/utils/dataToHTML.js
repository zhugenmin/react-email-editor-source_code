const createStyleString = (className, styles) => {
  const regex = new RegExp(/[A-Z]/g);
  const kebabCase = (str) => str.replace(regex, (v) => `-${v.toLowerCase()}`);

  let stylesConfig = {
    className: className,
    desktop: "",
    mobile: "",
  };

  for (let item of Object.entries(styles.desktop)) {
    if (item[1] && item[0] !== "contentBackground") {
      stylesConfig.desktop += `${kebabCase(item[0])}:${typeof item[1] === "number" ? item[1] + "px" : item[1]};`;
    }
  }

  if (Object.keys(styles.mobile).length) {
    let mobile = "";
    for (let item of Object.entries(styles.mobile)) {
      if (item[1] && item[0] !== "contentBackground") {
        mobile += `${kebabCase(item[0])}:${typeof item[1] === "number" ? item[1] + "px" : item[1]} !important;`;
      }
    }

    stylesConfig.mobile += `@media(max-width:620px){
    .${className} {
        ${mobile}
      }
    }`;
  }

  return stylesConfig;
};

const createStyleTag = (list, styles = "", parentIndex) => {
  const newBlockList = list.map((item, index) => {
    let newItem = item;
    newItem.styleConfig = createStyleString(parentIndex ? `${parentIndex}-${item.key}-${index}` : `${item.key}-${index}`, item.styles);

    if (newItem.contentStyles) {
      newItem.contentStyleConfig = createStyleString(`${item.key}-content-${index}`, item.contentStyles);

      if (newItem.contentStyleConfig.mobile) {
        styles += newItem.contentStyleConfig.mobile;
      }
    }
    if (newItem.styleConfig.mobile) {
      styles += newItem.styleConfig.mobile;
    }

    if (item.styles.desktop.contentBackground) {
      newItem.contentStyleConfig = {
        className: `${item.key}-content-${index}`,
        desktop: `background-color:${item.styles.desktop.contentBackground};`,
        mobile: "",
      };
    }

    // contentBackground => column内容的background
    if (item.styles.mobile.contentBackground) {
      newItem.contentStyleConfig.mobile = ` @media(max-width:620px){
        .${newItem.contentStyleConfig.className} {background-color:${item.styles.mobile.contentBackground};}
        }`;
      styles += newItem.contentStyleConfig.mobile;
    }

    if (item.children?.length) {
      const { newBlockList: childrenList, styles: childrenStyles } = createStyleTag(item.children, styles, index);
      styles += childrenStyles;
      newItem.children = childrenList;
    }

    return {
      ...newItem,
    };
  });

  return {
    newBlockList: newBlockList,
    styles: styles,
  };
};

const createImageString = (imageConfig) => {
  return `<div ${imageConfig.contentStyleConfig.mobile ? `class="${imageConfig.contentStyleConfig.className}"` : ""} 
  style="${imageConfig.contentStyleConfig.desktop}">
      <img src="${imageConfig.src}" alt="${imageConfig.alt}" style="max-width:100%;${imageConfig.styleConfig.desktop}" 
      ${imageConfig.styleConfig.mobile ? `class="${imageConfig.styleConfig.className}"` : ""}/> 
  </div>`;
};

const createTextString = (textBlock) => {
  return `<div ${textBlock.styleConfig.mobile ? `class="${textBlock.styleConfig.className}"` : ""} 
  style="${textBlock.styleConfig.desktop}">${textBlock.text}</div>`;
};

const createHeaderString = (headerBlock) => {
  return `<${headerBlock.type} ${headerBlock.styleConfig.mobile ? `class="${headerBlock.styleConfig.className}"` : ""} 
  style="${headerBlock.styleConfig.desktop}">
  ${headerBlock.text}
  </${headerBlock.type}>`;
};

const createButtonString = (buttonBlock) => {
  return `<div ${buttonBlock.contentStyleConfig.mobile ? `class="${buttonBlock.contentStyleConfig.className}"` : ""} 
  style="${buttonBlock.contentStyleConfig.desktop}">
    <a ${buttonBlock.styleConfig.mobile ? `class="${buttonBlock.styleConfig.className}"` : ""} 
    style="${buttonBlock.styleConfig.desktop}" target="_black" href="https://${buttonBlock.linkURL}">${buttonBlock.text}</a>
  </div>`;
};

const createDividerString = (dividerBLock) => {
  return `<div ${dividerBLock.contentStyleConfig.mobile ? `class="${dividerBLock.contentStyleConfig.className}"` : ""} 
  style="${dividerBLock.contentStyleConfig.desktop}">
    <div ${dividerBLock.styleConfig.mobile ? `class="${dividerBLock.styleConfig.className}"` : ""} 
    style="${dividerBLock.styleConfig.desktop}"></div>
  </div>`;
};

const createSocialLinkString = (socialLinkBlock) => {
  return `<div ${socialLinkBlock.contentStyleConfig.mobile ? `class="${socialLinkBlock.contentStyleConfig.className}"` : ""} 
  style="${socialLinkBlock.contentStyleConfig.desktop}">
    ${socialLinkBlock.list
      .map((socialLinkItem) => {
        const { image, title, linkURL } = socialLinkItem;
        return `<a target="_black" href="https://${linkURL}" style="${socialLinkBlock.styleConfig.desktop};display:inline-block;">
        <img src="${image}" alt="${title}" style="width:${socialLinkBlock.imageWidth}px;" 
        ${socialLinkBlock.styleConfig.mobile ? `class="${socialLinkBlock.styleConfig.className}"` : ""}/> 
      </a>`;
      })
      .join("")}
  </div>`;
};

const blockListToHtml = (blockList, bodySettings) => {
  let content = "";
  blockList.forEach((item) => {
    if (item.key === "column") {
      content += `<div ${item.styleConfig.mobile ? `class="${item.styleConfig.className}"` : ""} 
      style="${item.styleConfig.desktop};width:100%;display:block;">
        <table ${item.contentStyleConfig.mobile ? `class="${item.contentStyleConfig.className}"` : ""} 
        style="width:100%;max-width:${bodySettings.contentWidth}px;margin:0 auto;${item.contentStyleConfig.desktop}">
      <tbody><tr>${blockListToHtml(item.children)}</tr></tbody>
       </table></div>`;
    }

    if (item.key === "content") {
      content += `<td ${item.styleConfig.mobile ? `class="${item.styleConfig.className}"` : ""} 
      style="width:${item.width}; ${item.styleConfig.desktop}">${blockListToHtml(item.children)}</td>`;
    }

    if (item.key === "text") {
      content += createTextString(item);
    }

    if (item.key === "heading") {
      content += createHeaderString(item);
    }

    if (item.key === "image") {
      content += createImageString(item);
    }

    if (item.key === "button") {
      content += createButtonString(item);
    }

    if (item.key === "divider") {
      content += createDividerString(item);
    }

    if (item.key === "social_link") {
      content += createSocialLinkString(item);
    }
  });

  return content;
};

const dataToHtml = ({ bodySettings, blockList }) => {
  let content = "";
  const { newBlockList, styles } = createStyleTag(blockList);
  content = blockListToHtml(newBlockList, bodySettings);
  return `<html>
  <head>
  <meta charset="UTF-8">
  <title>email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style type="text/css">
  *{
    margin: 0;
    padding: 0;
    border: none;
    box-sizing: border-box;
  }

  html,body {
    height:100%;
    overflow-y:auto;
  }

  table {
    width: 100%;
    color:unset;
  }

  table, tr, td {
    vertical-align: top;
    border-collapse: collapse;
 }

  h1,h2,h3,h4 {
    display: block;
    margin-block-start: 0px;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  @media(max-width:620px){
    td {
      display:inline-block;
      width:100% !important;
    }
  }
  ${styles}
</style>
  </head>
  <body>
  <div style="opacity:0;">${bodySettings.preHeader}</div>
  <div style="background-color:${bodySettings.styles.backgroundColor};color:${bodySettings.styles.color}; font-family:${bodySettings.styles.fontFamily};"> ${content}</div>
  </body>
  </html>`;
};

export default dataToHtml;
