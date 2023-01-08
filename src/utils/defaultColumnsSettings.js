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

const defaultColumnsSettings = {
  full: {
    columns: 1,
    type: "full",
    data: [
      {
        name: "No content here. drag content here",
        width: "100%",
        styles: defaultStyles,
        key: "empty",
      },
    ],
  },
  "1-1": {
    columns: 2,
    type: "1-1",
    data: Array.from({ length: 2 }).map(() => {
      return {
        name: "No content here. drag content here",
        width: "50%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "1-1-1": {
    columns: 3,
    type: "1-1-1",
    data: Array.from({ length: 3 }).map(() => {
      return {
        name: "No content here. drag content here",
        width: "33.3%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "1-1-1-1": {
    columns: 4,
    type: "1-1-1-1",
    data: Array.from({ length: 4 }).map(() => {
      return {
        name: "No content here. drag content here",
        width: "25%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "1-2": {
    columns: 2,
    type: "1-2",
    data: Array.from({ length: 2 }).map((item, index) => {
      return {
        name: "No content here. drag content here",
        width: index === 0 ? "33.3%" : "66.6%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "2-1": {
    columns: 2,
    type: "2-1",
    data: Array.from({ length: 2 }).map((item, index) => {
      return {
        name: "No content here. drag content here",
        width: index === 0 ? "66.6%" : "33.3%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "2-4-2-4": {
    columns: 4,
    type: "2-4-2-4",
    data: Array.from({ length: 4 }).map((item, index) => {
      return {
        name: "No content here. drag content here",
        width: index % 2 === 0 ? "16.6%" : "33.3%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
  "4-2-4-2": {
    columns: 4,
    type: "4-2-4-2",
    data: Array.from({ length: 4 }).map((item, index) => {
      return {
        name: "No content here. drag content here",
        width: index % 2 === 0 ? "33.3%" : "16.6%",
        styles: defaultStyles,
        key: "empty",
      };
    }),
  },
};

export { defaultColumnsSettings, defaultStyles };
