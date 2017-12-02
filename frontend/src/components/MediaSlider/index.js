import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactSlick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


const COMPONENT_CLASS = 'media-slider'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class MediaSlider extends PureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      activeSlide: 0
    }
  }

  disableContextMenu(e) {
    e.preventDefault()
    return false
  }

  slide(medium) {
    return (
      <div className="slide">
        {medium.get('type') === 'video' && <video
          className="slide-media slide-video" src={medium.get('url')} controls />}
        {medium.get('type') === 'audio' && <audio
          className="slide-media slide-video" src={medium.get('url')} controls
          style={{ paddingTop: '60%', background: '#000' }} />}
        {medium.get('type') === 'image' && <div
          className="slide-media slide-image" style={{ backgroundImage: `url(${medium.get('url')})` }} />}
      </div>
    )
  }

  smallSlide(medium, index) {
    return (
      <div className={bem('bottom__slide-inner')} onClick={this.handleClickThumb(index)}>
        {medium.get('type') === 'video' && <video
          className="slide-media slide-video"
          src={medium.get('url')}
          disabled
          preload="metadata"
          onContextMenu={this.disableContextMenu}
        />}
        {medium.get('type') === 'audio' && <audio
          className="slide-media slide-video"
          src={medium.get('url')}
          disabled
          preload="metadata"
          onContextMenu={this.disableContextMenu}
          controls
          style={{ paddingTop: '60%', background: '#000' }}
        />}
        {medium.get('type') === 'image' && <div
          className="slide-media slide-image" style={{ backgroundImage: `url(${medium.get('url')})` }} />}
      </div>
    )
  }

  handleBeforeChangeBig = (oldIndex, index) => {
    this.setState({ activeSlide: index })
  }

  handleClickThumb = (index) => () => {
    // this.mainSlider.slickGoTo(index)
    this.setState({ activeSlide: index })
  }

  render() {
    const { media } = this.props
    const { activeSlide } = this.state

    const bigSliderSettings = {
      className: bem('top'),
      slickGoTo: activeSlide,
      beforeChange: this.handleBeforeChangeBig,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      adaptiveHeight: true
    }

    const smallSliderSettings = {
      className: bem('bottom'),
      slickGoTo: activeSlide,
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

    return media && (
      <div className={COMPONENT_CLASS}>
        <ReactSlick ref={slider => this.mainSlider = slider} {...bigSliderSettings}>
          {media.map((medium, index) => (
            <div key={index} className={bem('top__slide')}>
              {this.slide(medium)}
            </div>
          ))}
        </ReactSlick>

        {media.size > 1 && <ReactSlick {...smallSliderSettings}>
          {media.map((medium, index) => (
            <div key={index} className={bem('bottom__slide')}>
              {this.smallSlide(medium, index)}
            </div>
          ))}
        </ReactSlick>}
      </div>
    )
  }
}

export default MediaSlider
