import React from 'react';

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this
        .props
        .inverse();
    } else {
      this
        .props
        .center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};

    //如果props属性中指定了图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片有旋转角度 添加旋转角度
    if (this.props.arrange.rotate) {
      styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse
      ? ' is-inverse'
      : ' ';

    return (
      <figure
        className={imgFigureClassName}
        style={styleObj}
        onClick={this
        .handleClick
        .bind(this)}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div
            className="img-back"
            onClick={this
            .handleClick
            .bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

export default ImgFigure;