const getColumnConfigFunc = (t) => {
  return (item) => {
    const contentConfig = {
      name: t("drag_block_here"),
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
      name: t("column"),
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
          name: t("content"),
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
};

export default getColumnConfigFunc;
