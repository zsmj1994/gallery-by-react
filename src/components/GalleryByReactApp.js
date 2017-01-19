require('../styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import ControllerUnit from './ControllerUnit.js';
import ImgFigure from './ImgFigure.js';

//获取图片相关信息
let imageDatas = require('../data/imageDatas.json');

//将图片名信息转换为图片路径信息

imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内一个随机值
let getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取0-30 之间的正负值
let get30DegRandom = () => Math.ceil(30 - Math.random() * 60);

class GalleryByReactApp extends React.Component {

  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [
          0, 0
        ],
        rightSecX: [
          0, 0
        ],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [
          0, 0
        ],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        // {  pos:{    left:'0',    top:'0'  },    rotate:0, //旋转角度 isInverse:false
        // //正反面 isCenter:false 图片是否居中 }
      ]
    };
  }

  /*
   *翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的index值
   *@return {function} 这是一个闭包函数
  */
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({imgsArrangeArr: imgsArrangeArr})
    };
  }

  /*
   *利用rearrange函数。居中对应的图片
   */
  center(index) {
    return () => this.rearrange(index);
  }

  /*
   *重新布局图片
   *@param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSexX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中centerindex的图片,居中的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局上侧图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边，后半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSexX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({imgsArrangeArr: imgsArrangeArr});

  }

  componentDidMount() {
    //首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);

    //拿到一个imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgW;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上册区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {

    let controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index) => {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isCenter: false,
          isInverse: false
        }
      }

      imgFigures.push(<ImgFigure
        key={index}
        data={value}
        ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)}
        center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit
        key={index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)}
        center={this.center(index)}/>);

    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
