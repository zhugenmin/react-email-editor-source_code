const createStyleString = (className, styles) => {
  const regex = new RegExp(/[A-Z]/g);
  const kebabCase = (str) => str.replace(regex, (v) => `-${v.toLowerCase()}`);

  let stylesConfig = {
    className: className,
    desktop: "",
    mobile: "",
  };

  for (let item of Object.entries(styles.desktop)) {
    if (item[0] !== "contentBackground") {
      stylesConfig.desktop += `${kebabCase(item[0])}:${typeof item[1] === "number" ? item[1] + "px" : item[1]};`;
    }
  }

  if (Object.keys(styles.mobile).length) {
    let mobile = "";
    for (let item of Object.entries(styles.mobile)) {
      if (item[0] !== "contentBackground") {
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

const createStyleTag = (blockList) => {
  let styles = "";

  const newBlockList = blockList.map((item, index) => {
    const styleConfig = createStyleString(`${item.key}-${index}`, item.styles);
    const contentStyleConfig = {
      className: `${item.key}-content-${index}`,
      desktop: `background-color:${item.styles.desktop.contentBackground};`,
      mobile: "",
    };
    if (styleConfig.mobile) {
      styles += styleConfig.mobile;
    }

    // contentBackground => column内容的background
    if (item.styles.mobile.contentBackground) {
      contentStyleConfig.mobile = ` @media(max-width:620px){
        .${contentStyleConfig.className} {background-color:${item.styles.mobile.contentBackground};}
        }`;
      styles += contentStyleConfig.mobile;
    }

    return {
      ...item,
      config: {
        ...item.config,
        styleConfig: contentStyleConfig,
        data: item.config.data.map((dataItem, dataIndex) => {
          const dataStyleConfig = createStyleString(`content-${index}-${dataIndex}`, dataItem.styles);

          if (dataStyleConfig.mobile) {
            styles += dataStyleConfig.mobile;
          }
          return {
            ...dataItem,
            styleConfig: dataStyleConfig,
            data:
              dataItem.data &&
              dataItem.data.map((block, blockIndex) => {
                const blockStyleConfig = createStyleString(`${block.key}-${index}-${dataIndex}-${blockIndex}`, block.config.styles);

                if (blockStyleConfig.mobile) {
                  styles += blockStyleConfig.mobile;
                }

                const newBlock = { ...block, styleConfig: blockStyleConfig };
                if (block.config.contentStyles) {
                  const blockContentStyleConfig = createStyleString(
                    `${block.key}-content-${index}-${dataIndex}-${blockIndex}`,
                    block.config.contentStyles
                  );

                  if (blockContentStyleConfig.mobile) {
                    styles += blockContentStyleConfig.mobile;
                  }

                  newBlock.contentStyleConfig = blockContentStyleConfig;
                }
                return newBlock;
              }),
          };
        }),
      },
      styleConfig,
    };
  });
  return {
    newBlockList: newBlockList,
    styles: `<style type="text/css">
    *{
      margin: 0;
      box-sizing: border-box;
    }

    html,body {
      height:100%;
      overflow-y:auto;
    }

    table {
      width: 100%;
    }

    table, tr, td {
      vertical-align: top;
      border-collapse: collapse;
   }

    @media(max-width:620px){
      td {
        display:inline-block;
        width:100% !important;
      }
    }
    ${styles}
  </style>`,
  };
};

const createImageString = (imageConfig) => {
  return `<div ${imageConfig.contentStyleConfig.mobile ? `class="${imageConfig.contentStyleConfig.className}"` : ""} 
  style="${imageConfig.contentStyleConfig.desktop}">
      <img src="${imageConfig.config.src}" alt="${imageConfig.config.alt}" style="max-width:100%;${imageConfig.styleConfig.desktop}" 
      ${imageConfig.styleConfig.mobile ? `class="${imageConfig.styleConfig.className}"` : ""}/> 
  </div>`;
};

const createTextString = (textBlock) => {
  return `<div ${textBlock.styleConfig.mobile ? `class="${textBlock.styleConfig.className}"` : ""} 
  style="${textBlock.styleConfig.desktop}">${textBlock.config.text}</div>`;
};

const createHeaderString = (headerBlock) => {
  return `<${headerBlock.config.type} ${headerBlock.styleConfig.mobile ? `class="${headerBlock.styleConfig.className}"` : ""} 
  style="${headerBlock.styleConfig.desktop}">
  ${headerBlock.config.text}
  </${headerBlock.config.type}>`;
};

const createButtonString = (buttonBlock) => {
  return `<div ${buttonBlock.contentStyleConfig.mobile ? `class="${buttonBlock.contentStyleConfig.className}"` : ""} 
  style="${buttonBlock.contentStyleConfig.desktop}">
    <a ${buttonBlock.styleConfig.mobile ? `class="${buttonBlock.styleConfig.className}"` : ""} 
    style="${buttonBlock.styleConfig.desktop}" target="_black" link="${buttonBlock.config.linkURL}">${buttonBlock.config.text}</a>
  </div>`;
};

const createDividerString = (dividerBLock) => {
  return `<div ${dividerBLock.contentStyleConfig.mobile ? `class="${dividerBLock.contentStyleConfig.className}"` : ""} 
  style="${dividerBLock.contentStyleConfig.desktop}">
    <div ${dividerBLock.styleConfig.mobile ? `class="${dividerBLock.styleConfig.className}"` : ""} 
    style="${dividerBLock.styleConfig.desktop}"></div>
  </div>`;
};

const dataToHtml = (data) => {
  const { bodySettings, blockList } = data;
  let content = "";
  const { newBlockList, styles } = createStyleTag(blockList);

  newBlockList.forEach((item) => {
    const { config } = item;
    let rowDomString = "";
    config.data.forEach((row) => {
      let blocks = "";
      row.data &&
        row.data.forEach((block) => {
          if (block.key === "image") {
            blocks += createImageString(block);
          }

          if (block.key === "text") {
            blocks += createTextString(block);
          }

          if (block.key === "heading") {
            blocks += createHeaderString(block);
          }

          if (block.key === "button") {
            blocks += createButtonString(block);
          }

          if (block.key === "divider") {
            blocks += createDividerString(block);
          }
        });

      rowDomString += `<td ${row.styleConfig.mobile ? `class="${row.styleConfig.className}"` : ""} 
      style="width:${row.width}; ${row.styleConfig.desktop}">${blocks}</td>`;
    });

    const itemDomString = `<div ${item.styleConfig.mobile ? `class="${item.styleConfig.className}"` : ""} 
    style="${item.styleConfig.desktop};width:100%;display:block;">
      <table ${item.config.styleConfig.mobile ? `class="${item.config.styleConfig.className}"` : ""} 
      style="width:100%;max-width:${bodySettings.contentWidth}px;margin:0 auto;${item.config.styleConfig.desktop}">
    <tbody><tr>${rowDomString}</tr></tbody>
     </table></div>`;

    content += itemDomString;
  });
  return `<html>
    <head>
      <meta charset="UTF-8">
      <title>email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    ${styles}
    <body>
      <div style="background-color:${bodySettings.styles.backgroundColor};color:${bodySettings.styles.color}; font-family:${bodySettings.styles.fontFamily};"> ${content}</div>
    </body>
  </html>
  `;
};

export default dataToHtml;
