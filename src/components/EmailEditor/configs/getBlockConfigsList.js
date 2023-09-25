const getBlockConfigsList = (t) => {
  return [
    {
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
          children: [
            {
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
            },
          ],
        },
      ],
    },
    {
      name: t("text"),
      key: "text",
      text: t("text_content"),
      styles: {
        desktop: {
          fontSize: 14,
          fontFamily: "sans-serif",
          color: undefined,
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
    {
      name: t("heading"),
      key: "heading",
      text: t("heading_content"),
      type: "h1",
      styles: {
        desktop: {
          fontSize: 22,
          lineHeight: "140%",
          fontFamily: "sans-serif",
          color: undefined,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "left",
          fontWeight: "bold",
        },
        mobile: {},
      },
    },
    {
      name: t("button"),
      key: "button",
      text: t("button"),
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
    {
      name: t("divider"),
      key: "divider",
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
    {
      name: t("image"),
      key: "image",
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
    {
      name: t("social_link"),
      key: "social_link",
      list: [
        {
          image: "https://iili.io/HMnhdkN.png",
          title: "facebook",
          linkURL: "",
        },
        {
          image: "https://iili.io/J9qWqNV.png",
          title: "Instagram",
          linkURL: "",
        },
        {
          image: "https://iili.io/J9qWBDB.png",
          title: "TikTok",
          linkURL: "",
        },
        {
          image: "https://iili.io/J9qWnoP.png",
          title: "Twitter",
          linkURL: "",
        },
      ],
      imageWidth: 32,
      contentStyles: {
        desktop: {
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          paddingRight: 12,
          textAlign: "left",
        },
        mobile: {},
      },
      styles: {
        desktop: { paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6 },
        mobile: {},
      },
    },
  ];
};

export default getBlockConfigsList;
