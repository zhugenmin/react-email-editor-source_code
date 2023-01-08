const blockConfigsList = [
  {
    name: "列",
    key: "column",
    styles: {
      desktop: {
        backgroundColor: "transparent",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        contentBackground: "transparent",
      },
      mobile: {},
    },
    config: {
      columns: 1,
      type: "full",
      styles: {
        desktop: {
          backgroundColor: "transparent",
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        },
        mobile: {},
      },
      data: [
        {
          name: "No content here. drag content here",
          width: "100%",
          styles: {
            desktop: {
              backgroundColor: "transparent",
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
            },
            mobile: {},
          },
          key: "empty",
        },
      ],
    },
  },
  {
    name: "文本",
    key: "text",
    config: {
      text: "这是一个文本，点击修改文本",
      styles: {
        desktop: {
          fontSize: 14,
          fontFamily: "sans-serif",
          color: "#000",
          lineHeight: "140%",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "left",
        },
        mobile: {},
      },
    },
  },
  {
    name: "标题",
    key: "heading",
    config: {
      text: "这是一个标题，点击修改标题",
      type: "h1",
      styles: {
        desktop: {
          fontSize: 22,
          lineHeight: "140%",
          fontFamily: "sans-serif",
          color: "#000",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "left",
        },
        mobile: {},
      },
    },
  },
  {
    name: "按钮",
    key: "button",
    config: {
      text: "按钮",
      type: "link",
      linkURL: "",
      contentStyles: {
        desktop: {
          textAlign: "center",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
        },
        mobile: {},
      },
      styles: {
        desktop: {
          width: "auto",
          fontSize: 12,
          lineHeight: "140%",
          borderRadius: 4,
          fontFamily: "sans-serif",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: "#2faade",
          color: "#fff",
          display: "inline-block",
        },
        mobile: {},
      },
    },
  },
  {
    name: "分割线",
    key: "divider",
    config: {
      contentStyles: {
        desktop: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "center",
        },
        mobile: {},
      },
      styles: {
        desktop: {
          width: "100%",
          borderTopStyle: "solid",
          borderTopColor: "#ccc",
          borderTopWidth: 1,
          display: "inline-block",
          verticalAlign: "middle",
        },
        mobile: {},
      },
    },
  },
  {
    name: "图片",
    key: "image",
    config: {
      src: "",
      alt: "Image",
      type: "link",
      linkURL: "",
      contentStyles: {
        desktop: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "center",
        },
        mobile: {},
      },
      styles: {
        desktop: {
          width: "auto",
        },
        mobile: {},
      },
    },
  },
];

export default blockConfigsList;
