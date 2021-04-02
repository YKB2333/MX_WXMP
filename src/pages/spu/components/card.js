
export default class LastMayday {
  palette() {
    return (
      {
        "width": "288px",
        "height": "512px",
        "background": "#ffffff",
        "views": [
          {
            "type": "image",
            "url": "",
            "css": {
              "width": "288px",
              "height": "288px",
              "top": "0px",
              "left": "0px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },
          {
            "type": "text",
            "text": "",
            "css": {
              "color": "#000000",
              "background": "rgba(0,0,0,0)",
              "width": "256px",
              "height": "43.48499999999999px",
              "top": "300px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "15px",
              "fontWeight": "normal",
              "maxLines": "2",
              "lineHeight": "21.645000000000003px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": "",
            "price":"salePrice",
            "css": {
              "color": "#B60909",
              "background": "rgba(0,0,0,0)",
              "width": "",
              "height": "34.32px",
              "top": "354px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "24px",
              "fontWeight": "normal",
              "maxLines": "1",
              "lineHeight": "34.632000000000005px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": "",
            "price":"plateformPrice",
            "css": {
              "color": "#C9CACA",
              "background": "rgba(0,0,0,0)",
              "width": "",
              "height": "20.02px",
              "top": "364px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "14px",
              "fontWeight": "normal",
              "maxLines": "1",
              "lineHeight": "20.202000000000005px",
              "textStyle": "fill",
              "textDecoration": "line-through",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": "                                                                                          ",
            "css": {
              "color": "#DDDDDD",
              "background": "rgba(0,0,0,0)",
              "width": "256px",
              "height": "20.02px",
              "top": "394px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "14px",
              "fontWeight": "normal",
              "maxLines": "1",
              "lineHeight": "20.202000000000005px",
              "textStyle": "fill",
              "textDecoration": "overline",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": "长按识别小程序立即购买",
            "css": {
              "color": "#595757",
              "background": "rgba(0,0,0,0)",
              "width": "156px",
              "height": "20.02px",
              "top": "430px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "14px",
              "fontWeight": "normal",
              "maxLines": "1",
              "lineHeight": "20.202000000000005px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": "来自 秒寻",
            "css": {
              "color": "#C9CACA",
              "background": "rgba(0,0,0,0)",
              "width": "90px",
              "height": "20.02px",
              "top": "452px",
              "left": "16px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "14px",
              "fontWeight": "normal",
              "maxLines": "1",
              "lineHeight": "20.202000000000005px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "萍方-简",
              "textAlign": "left"
            }
          },
          {
            "type": "image",
            "url": "",
            "css": {
              "width": "90px",
              "height": "90px",
              "top": "406px",
              "left": "182px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },
        ]
      }
    );
  }
}


const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      id: `image-${index}`,
      type: 'image',
      url: '/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        shadow: '10rpx 10rpx 5rpx #888888',
        rotate: rotate,
        minWidth: '60rpx',
        borderRadius: borderRadius,
        scalable: true,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
