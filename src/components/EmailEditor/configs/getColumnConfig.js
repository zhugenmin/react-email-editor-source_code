const getColumnConfig = (item) => {
  const contentConfig = {
    name: "请将模块拖放到此处",
    key: "empty",
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
  };

  return {
    name: "列",
    key: "column",
    type: "full",
    styles: {
      key: "column",
      desktop: {
        backgroundColor: "transparent",
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        contentBackground: "#fff",
      },
      mobile: {},
    },
    children: [
      {
        name: "容器",
        key: "content",
        width: "100%",
        styles: {
          key: "column",
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
        children: [item ? item : contentConfig],
      },
    ],
  };
};

export default getColumnConfig;
