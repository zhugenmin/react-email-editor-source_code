export const SET_PREVIEW_MODE = "AUTH_OPTIONS/SET_PREVIEW_MODE";
export const SET_BLOCK_LIST = "AUTH_OPTIONS/SET_BLOCK_LIST";
export const SET_BLOCK_LIST_ACTION = "AUTH_OPTIONS/SET_BLOCK_LIST_ACTION";
/**
 * Fetch user, accountId is same in Auth0 and DB
 * If user not found, redirect to 500 page. Because
 *   we have a mismatch. The user is in auth0
 *   but not in our system.
 */

export const setPreviewMode = (previewMode) => ({
  type: SET_PREVIEW_MODE,
  previewMode: previewMode,
});

export const setBlockList =
  (blockList, action = "modify") =>
  (dispatch, getState) => {
    const currentBlockListAction = getState().AuthOptions.blockListAction;
    currentBlockListAction !== action && dispatch(setBlockListAction(action))
    dispatch({
      type: SET_BLOCK_LIST,
      blockList: blockList,
    });
  };

export const setBlockListAction = (blockListAction) => ({
  type: SET_BLOCK_LIST_ACTION,
  blockListAction: blockListAction,
});

export default function reducer(
  state = {
    previewMode: "desktop",
    blockList: [
        {
            "name": "列",
            "key": "column",
            "styles": {
                "desktop": {
                    "backgroundColor": "transparent",
                    "paddingTop": 0,
                    "paddingLeft": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "contentBackground": "#ffffff"
                },
                "mobile": {}
            },
            "config": {
                "columns": 1,
                "type": "full",
                "styles": {
                    "desktop": {
                        "backgroundColor": "transparent",
                        "paddingTop": 0,
                        "paddingLeft": 0,
                        "paddingRight": 0,
                        "paddingBottom": 0
                    },
                    "mobile": {}
                },
                "data": [
                    {
                        "name": "content",
                        "key": "content",
                        "width": "100%",
                        "styles": {
                            "desktop": {
                                "backgroundColor": "#ffffff",
                                "paddingTop": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0,
                                "paddingBottom": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "标题",
                                "key": "heading",
                                "config": {
                                    "text": "Your Logo",
                                    "type": "h1",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 22,
                                            "lineHeight": "110%",
                                            "fontFamily": "sans-serif",
                                            "color": "#000",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "<font color=\"#202124\" face=\"consolas, lucida console, courier new, monospace\"><span style=\"font-size: 12px; white-space: pre-wrap;\">NEW COLLECTION</span></font><br>",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 14,
                                            "fontFamily": "sans-serif",
                                            "color": "#000",
                                            "lineHeight": "110%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "图片",
                                "key": "image",
                                "config": {
                                    "src": "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                                    "alt": "Coffee Beans",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 0,
                                            "paddingBottom": 0,
                                            "paddingLeft": 0,
                                            "paddingRight": 0,
                                            "textAlign": "center"
                                        },
                                        "mobile": {},
                                        "paddingRight": 0,
                                        "paddingBottom": 0,
                                        "paddingLeft": 0,
                                        "paddingTop": 0
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "<font color=\"#202124\" face=\"consolas, lucida console, courier new, monospace\" style=\"font-size: 30px;\"><span style=\"white-space: pre-wrap;\"><b style=\"\">You might alse like</b></span></font><br>",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 27,
                                            "fontFamily": "sans-serif",
                                            "color": "#000",
                                            "lineHeight": "110%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "Discover hundreds of styles from all your favorite brands right here and save up to 50%. What are you waiting for?<br>",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 13,
                                            "fontFamily": "sans-serif",
                                            "color": "#000",
                                            "lineHeight": "110%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "按钮",
                                "key": "button",
                                "config": {
                                    "text": "立即购买",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "textAlign": "center",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto",
                                            "fontSize": 12,
                                            "lineHeight": "110%",
                                            "borderRadius": 4,
                                            "fontFamily": "sans-serif",
                                            "paddingTop": 10,
                                            "paddingBottom": 10,
                                            "paddingLeft": 20,
                                            "paddingRight": 20,
                                            "backgroundColor": "#865548",
                                            "color": "#fff",
                                            "display": "inline-block"
                                        },
                                        "mobile": {
                                            "width": "100%"
                                        }
                                    }
                                }
                            },
                            {
                                "name": "分割线",
                                "key": "divider",
                                "config": {
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {},
                                        "textAlign": "center"
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "69%",
                                            "borderTopStyle": "solid",
                                            "borderTopColor": "#ccc",
                                            "borderTopWidth": 1,
                                            "display": "inline-block",
                                            "verticalAlign": "middle"
                                        },
                                        "mobile": {
                                            "width": "100%"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "name": "列",
            "key": "column",
            "styles": {
                "desktop": {
                    "backgroundColor": "transparent",
                    "paddingTop": 0,
                    "paddingLeft": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "contentBackground": "#ffffff"
                },
                "mobile": {}
            },
            "config": {
                "columns": 2,
                "type": "1-1",
                "data": [
                    {
                        "name": "content",
                        "key": "content",
                        "width": "50%",
                        "styles": {
                            "desktop": {
                                "backgroundColor": "#ffffff",
                                "paddingTop": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0,
                                "paddingBottom": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "Coffee 1",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 12,
                                            "fontFamily": "仿宋",
                                            "color": "#000",
                                            "lineHeight": "120%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "图片",
                                "key": "image",
                                "config": {
                                    "src": "https://images.pexels.com/photos/129207/pexels-photo-129207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                                    "alt": "White Ceramic Coffee Cup on White Saucer",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto"
                                        },
                                        "mobile": {}
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "content",
                        "key": "content",
                        "width": "50%",
                        "styles": {
                            "desktop": {
                                "textAlign": "center",
                                "paddingTop": 0,
                                "paddingBottom": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "Coffee 2",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 11,
                                            "fontFamily": "仿宋",
                                            "color": "#000",
                                            "lineHeight": "120%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "图片",
                                "key": "image",
                                "config": {
                                    "src": "https://images.pexels.com/photos/1752806/pexels-photo-1752806.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                                    "alt": "Person Showing White Mug in Focus Photography",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto"
                                        },
                                        "mobile": {}
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "name": "列",
            "key": "column",
            "styles": {
                "desktop": {
                    "backgroundColor": "transparent",
                    "paddingTop": 0,
                    "paddingLeft": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "contentBackground": "#ffffff"
                },
                "mobile": {}
            },
            "config": {
                "columns": 2,
                "type": "1-1",
                "data": [
                    {
                        "name": "content",
                        "key": "content",
                        "width": "50%",
                        "styles": {
                            "desktop": {
                                "backgroundColor": "#ffffff",
                                "paddingTop": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0,
                                "paddingBottom": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "Coffee 3",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 12,
                                            "fontFamily": "仿宋",
                                            "color": "#000",
                                            "lineHeight": "120%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "图片",
                                "key": "image",
                                "config": {
                                    "src": "https://images.pexels.com/photos/129207/pexels-photo-129207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                                    "alt": "White Ceramic Coffee Cup on White Saucer",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto"
                                        },
                                        "mobile": {}
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "content",
                        "key": "content",
                        "width": "50%",
                        "styles": {
                            "desktop": {
                                "textAlign": "center",
                                "paddingTop": 0,
                                "paddingBottom": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "Coffee 3",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 11,
                                            "fontFamily": "仿宋",
                                            "color": "#000",
                                            "lineHeight": "120%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "图片",
                                "key": "image",
                                "config": {
                                    "src": "https://images.pexels.com/photos/1752806/pexels-photo-1752806.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                                    "alt": "Person Showing White Mug in Focus Photography",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto"
                                        },
                                        "mobile": {}
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "name": "列",
            "key": "column",
            "styles": {
                "desktop": {
                    "backgroundColor": "transparent",
                    "paddingTop": 0,
                    "paddingLeft": 0,
                    "paddingRight": 0,
                    "paddingBottom": 0,
                    "contentBackground": "#865548"
                },
                "mobile": {}
            },
            "config": {
                "columns": 1,
                "type": "full",
                "styles": {
                    "desktop": {
                        "backgroundColor": "transparent",
                        "paddingTop": 0,
                        "paddingLeft": 0,
                        "paddingRight": 0,
                        "paddingBottom": 0
                    },
                    "mobile": {}
                },
                "data": [
                    {
                        "name": "content",
                        "key": "content",
                        "width": "100%",
                        "styles": {
                            "desktop": {
                                "backgroundColor": "transparent",
                                "paddingTop": 0,
                                "paddingLeft": 0,
                                "paddingRight": 0,
                                "paddingBottom": 0
                            },
                            "mobile": {}
                        },
                        "data": [
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "No longer wants to receive this email?",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 14,
                                            "fontFamily": "sans-serif",
                                            "color": "#ffffff",
                                            "lineHeight": "110%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "按钮",
                                "key": "button",
                                "config": {
                                    "text": "Unsubscribe",
                                    "type": "link",
                                    "linkURL": "",
                                    "contentStyles": {
                                        "desktop": {
                                            "textAlign": "center",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12
                                        },
                                        "mobile": {}
                                    },
                                    "styles": {
                                        "desktop": {
                                            "width": "auto",
                                            "fontSize": 12,
                                            "lineHeight": "110%",
                                            "borderRadius": 4,
                                            "fontFamily": "sans-serif",
                                            "paddingTop": 0,
                                            "paddingBottom": 0,
                                            "paddingLeft": 0,
                                            "paddingRight": 0,
                                            "backgroundColor": "#865548",
                                            "color": "#fff",
                                            "display": "inline-block"
                                        },
                                        "mobile": {}
                                    }
                                }
                            },
                            {
                                "name": "文本",
                                "key": "text",
                                "config": {
                                    "text": "@由邮件编辑器提供技术支持",
                                    "styles": {
                                        "desktop": {
                                            "fontSize": 12,
                                            "fontFamily": "sans-serif",
                                            "color": "#ffffff",
                                            "lineHeight": "110%",
                                            "paddingTop": 12,
                                            "paddingBottom": 12,
                                            "paddingLeft": 12,
                                            "paddingRight": 12,
                                            "textAlign": "center"
                                        },
                                        "mobile": {}
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ],
    blockListAction: "firstRender",
  },
  action
) {
  switch (action.type) {
    case SET_PREVIEW_MODE:
      return {
        ...state,
        previewMode: action.previewMode,
      };
    case SET_BLOCK_LIST:
      return {
        ...state,
        blockList: action.blockList,
      };
    case SET_BLOCK_LIST_ACTION:
      return {
        ...state,
        blockListAction: action.blockListAction,
      };
    default:
      break;
  }

  return state;
}
