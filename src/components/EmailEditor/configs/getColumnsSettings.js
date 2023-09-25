const getColumnsSettings = (t) => {
  const defaultStyles = {
    desktop: {
      textAlign: "center",
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
    },
    mobile: {},
  };

  return {
    full: {
      columns: 1,
      type: "full",
      children: [
        {
          name: t("drag_block_here"),
          width: "100%",
          styles: defaultStyles,
          key: "empty",
        },
      ],
    },
    "1-1": {
      columns: 2,
      type: "1-1",
      children: Array.from({ length: 2 }).map(() => {
        return {
          name: t("content"),
          key: "content",
          width: "50%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "1-1-1": {
      columns: 3,
      type: "1-1-1",
      children: Array.from({ length: 3 }).map(() => {
        return {
          name: t("content"),
          key: "content",
          width: "33.3%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "1-1-1-1": {
      columns: 4,
      type: "1-1-1-1",
      children: Array.from({ length: 4 }).map(() => {
        return {
          name: t("content"),
          key: "content",
          width: "25%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "1-2": {
      columns: 2,
      type: "1-2",
      children: Array.from({ length: 2 }).map((item, index) => {
        return {
          name: t("content"),
          key: "content",
          width: index === 0 ? "33.3%" : "66.6%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "2-1": {
      columns: 2,
      type: "2-1",
      children: Array.from({ length: 2 }).map((item, index) => {
        return {
          name: t("content"),
          key: "content",
          width: index === 0 ? "66.6%" : "33.3%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "2-4-2-4": {
      columns: 4,
      type: "2-4-2-4",
      children: Array.from({ length: 4 }).map((item, index) => {
        return {
          name: t("content"),
          key: "content",
          width: index % 2 === 0 ? "16.6%" : "33.3%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
    "4-2-4-2": {
      columns: 4,
      type: "4-2-4-2",
      children: Array.from({ length: 4 }).map((item, index) => {
        return {
          name: t("content"),
          key: "content",
          width: index % 2 === 0 ? "33.3%" : "16.6%",
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
          children: [
            {
              name: t("drag_block_here"),
              key: "empty",
              width: "100%",
              styles: defaultStyles,
            },
          ],
        };
      }),
    },
  };
};

export default getColumnsSettings;
