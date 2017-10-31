import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactSlick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './style.css'


class Slider extends PureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired
  }

  disableContextMenu(e) {
    e.preventDefault()
    return false
  }

  slide(medium) {
    return (
      <div className="slide">
        {medium.get('type') === 'video' && <video
          className="slide-inner slide-video" src={medium.get('url')} controls />}
        {medium.get('type') === 'audio' && <audio
          className="slide-inner slide-video" src={medium.get('url')} controls
          style={{ paddingTop: '60%', background: '#000' }} />}
        {medium.get('type') === 'image' && <div
          className="slide-inner slide-image" style={{ backgroundImage: `url(${medium.get('url')})` }} />}
      </div>
    )
  }

  smallSlide(medium, index) {
    return (
      <div className="slide-thumb" onClick={this.handleClickThumb.bind(this, index)}>
        {medium.get('type') === 'video' && <video
          className="slide-inner slide-video"
          src={medium.get('url')}
          disabled
          preload="metadata"
          onContextMenu={this.disableContextMenu}
        />}
        {medium.get('type') === 'audio' && <audio
          className="slide-inner slide-video"
          src={medium.get('url')}
          disabled
          preload="metadata"
          onContextMenu={this.disableContextMenu}
          controls
          style={{ paddingTop: '60%', background: '#000' }}
        />}
        {medium.get('type') === 'image' && <div
          className="slide-inner slide-image" style={{ backgroundImage: `url(${medium.get('url')})` }} />}
      </div>
    )
  }

  handleClickThumb = (index) => {
    this.mainSlider.slickGoTo(index)
  }

  render() {
    const { media } = this.props

    const bigSliderSettings = {
      className: 'mb-4',
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true
    }

    const smallSliderSettings = {
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: false,
      centerMode: true,
      focusOnSelect: true,
      responsive: [
        { breakpoint: 600, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 4 } },
        { breakpoint: 1024, settings: { slidesToShow: 5 } },
      ]
    }

    return (
      <div>
        <ReactSlick ref={slider => this.mainSlider = slider} {...bigSliderSettings}>
          {media.map((medium, index) => (
            <div key={index} className="px-2">
              {this.slide(medium)}
            </div>
          ))}
        </ReactSlick>

        {media.size > 1 && <ReactSlick {...smallSliderSettings}>
          {media.map((medium, index) => (
            <div key={index} className="px-2">
              {this.smallSlide(medium, index)}
            </div>
          ))}
        </ReactSlick>}
      </div>
    )
  }
}

export default Slider
