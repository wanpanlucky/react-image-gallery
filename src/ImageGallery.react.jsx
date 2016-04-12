import React from 'react'
import Swipeable from 'react-swipeable'

const LEFT = 'left'
const CENTER = 'center'
const RIGHT = 'right'

export default class ImageGallery extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.startIndex,
      thumbnailsTranslateX: 0,
      offsetPercentage: 0,
      containerWidth: 0,
      slideStyles: []
    }
    this._handleResize = this._handleResize.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.containerWidth !== this.state.containerWidth ||
        prevProps.showThumbnails !== this.props.showThumbnails) {

      // adjust thumbnail container when window width is adjusted
      // when the container resizes, thumbnailsTranslateX
      // should always be negative (moving right),
      // if container fits all thumbnails its set to 0

      this._setThumbnailsTranslateX(
        -this._getScrollX(this.state.currentIndex > 0 ? 1 : 0) *
        this.state.currentIndex)

    }

    if (prevState.currentIndex !== this.state.currentIndex) {

      // call back function if provided
      if (this.props.onSlide) {
        this.props.onSlide(this.state.currentIndex)
      }

      // calculates thumbnail container position
      if (this.state.currentIndex === 0) {
        this._setThumbnailsTranslateX(0)
      } else {
        let indexDifference = Math.abs(
          prevState.currentIndex - this.state.currentIndex)
        let scrollX = this._getScrollX(indexDifference)
        if (scrollX > 0) {
          if (prevState.currentIndex < this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX - scrollX)
          } else if (prevState.currentIndex > this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX + scrollX)
          }
        }
      }
    }
  }

  componentWillMount() {
    this._thumbnailDelay = 300
    this._ghotClickDelay = 600
    this._preventGhostClick = false
  }

  componentDidMount() {
    this._handleResize()
    if (this.props.autoPlay) {
      this.play()
    }
    window.addEventListener('resize', this._handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize)
    if (this._intervalId) {
      window.clearInterval(this._intervalId)
      this._intervalId = null
    }
  }

  play() {
    if (this._intervalId) {
      return
    }
    this._intervalId = window.setInterval(() => {
      if (!this.state.hovering) {
        this.slideToIndex(this.state.currentIndex + 1)
      }
    }, this.props.slideInterval)
  }

  pause() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId)
      this._intervalId = null
    }
  }

  _wrapClick(func) {
    if (typeof func === 'function') {
      return event => {
        if (this._preventGhostClick === true) {
          return
        }
        func(event)
      }
    }
  }

  _touchEnd() {
    this._preventGhostClick = true
    this._preventGhostClickTimer = window.setTimeout(() => {
      this._preventGhostClick = false
      this._preventGhostClickTimer = null
    }, this._ghotClickDelay)
  }

  _setThumbnailsTranslateX(x) {
    this.setState({thumbnailsTranslateX: x})
  }

  _handleResize() {
    this.setState({containerWidth: this._imageGallery.offsetWidth})
  }

  _getScrollX(indexDifference) {
    if (this.props.disableThumbnailScroll) {
      return 0
    }
    if (this._thumbnails) {
      if (this._thumbnails.scrollWidth <= this.state.containerWidth) {
        return 0
      }

      let totalThumbnails = this._thumbnails.children.length

      // total scroll-x required to see the last thumbnail
      let totalScrollX = this._thumbnails.scrollWidth - this.state.containerWidth

      // scroll-x required per index change
      let perIndexScrollX = totalScrollX / (totalThumbnails - 1)

      return indexDifference * perIndexScrollX
    }
  }

  _handleMouseOverThumbnails(index) {
    if (this.props.slideOnThumbnailHover) {
      this.setState({hovering: true})
      if (this._thumbnailTimer) {
        window.clearTimeout(this._thumbnailTimer)
        this._thumbnailTimer = null
      }
      this._thumbnailTimer = window.setTimeout(() => {
        this.slideToIndex(index)
        this.pause()
      }, this._thumbnailDelay)
    }
  }

  _handleMouseLeaveThumbnails() {
    if (this._thumbnailTimer) {
      window.clearTimeout(this._thumbnailTimer)
      this._thumbnailTimer = null
      if (this.props.autoPlay == true) {
        this.play()
      }
    }
    this.setState({hovering: false})
  }

  _handleMouseOver() {
    this.setState({hovering: true})
  }

  _handleMouseLeave() {
    this.setState({hovering: false})
  }

  _getAlignmentClassName(index) {
    let currentIndex = this.state.currentIndex
    let alignment = ''
    switch (index) {
      case (currentIndex - 1):
        alignment = ` ${LEFT}`
        break
      case (currentIndex):
        alignment = ` ${CENTER}`
        break
      case (currentIndex + 1):
        alignment = ` ${RIGHT}`
        break
    }

    if (this.props.items.length >= 3) {
      if (index === 0 && currentIndex === this.props.items.length - 1) {
        // set first slide as right slide if were sliding right from last slide
        alignment = ` ${RIGHT}`
      } else if (index === this.props.items.length - 1 && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = ` ${LEFT}`
      }
    }

    return alignment
  }

  _handleImageLoad(event) {
    // slide images have an opacity of 0, onLoad the class 'loaded' is added
    // so that it transitions smoothly when navigating to non adjacent slides
    if (event.target.className.indexOf('loaded') === -1) {
      event.target.className += 'loaded'
    }
  }

  _handleImageError(event) {
    if (this.props.defaultImage && event.target.src.indexOf(this.props.defaultImage) === -1) {
      event.target.src = this.props.defaultImage
    }
  }

  _hasMinSlidesToShowNav() {
    return this.props.items.length >= 2
  }

  _swipingRight(_, delta) {
    const offsetPercentage = delta / this.state.containerWidth * 100
    this.setState({offsetPercentage})
  }

  _swipingLeft(_, delta) {
    const offsetPercentage = -delta / this.state.containerWidth * 100
    this.setState({offsetPercentage})
  }

  slideToIndex(index, event) {
    let slideCount = this.props.items.length - 1

    let currentIndex

    if (index < 0) {
      currentIndex = slideCount
    } else if (index > slideCount) {
      currentIndex = 0
    } else {
      currentIndex = index
    }

    let style = {}
    // only display the current index, and the next index slide
    if (index === this.state.currentIndex || currentIndex === index) {
      style = {
        transition: 'transform .45s ease-out'
      }
    } else {
      style = {
        display: 'none'
      }
    }

    this.setState({
      currentIndex: currentIndex,
      offsetPercentage: 0,
      style: style
    })

    window.setTimeout(() => {
      this.setState({style: {}})
    }, 500)

    if (event) {
      if (this._intervalId) {
        // user event, reset interval
        this.pause()
        this.play()
      }
    }
  }

  _setSlideStyles() {
    this.props.items.map((item, index) => {
      this.state.slideStyles[index] = this._getSlideStyle(index)
      this.setState({
         slideStyles: this.state.slideStyles.slice(0)
      })
    })
  }

  _getSlideStyle(index) {
    const {currentIndex} = this.state
    const basetranslateX = -100 * currentIndex
    const totalSlides = this.props.items.length - 1

    let translateX = basetranslateX + (index * 100) + this.state.offsetPercentage

    if (currentIndex === 0 && index === totalSlides) {
      // make the last slide the slide before the first
      translateX = -100 + this.state.offsetPercentage
    } else if (currentIndex === totalSlides && index === 0) {
      // make the first slide the slide after the last
      //XIAO TODO TEST with less than 3 images
      translateX = 100 + this.state.offsetPercentage
    }

    const translate3D = `translate3d(${translateX}%, 0, 0)`
    return {
      transform: translate3D
    }
  }

  _getThumbnailStyle() {
    const translate3D = `translate3d(${this.state.thumbnailsTranslateX}px, 0, 0)`
    return {
      transform: translate3D
    }

  }

  _handleOnSwiped(ev, x, y, isFlick) {
    this.setState({isFlick: isFlick})
  }

  render() {
    const currentIndex = this.state.currentIndex
    const thumbnailStyle = this._getThumbnailStyle()

    const swipePrev = this.slideToIndex.bind(this, currentIndex - 1)
    const swipeNext = this.slideToIndex.bind(this, currentIndex + 1)

    const swipingPrev = this._swipingRight.bind(this)
    const swipingNext = this._swipingLeft.bind(this)

    const offsetPercentage = Math.abs(this.state.offsetPercentage)
    const isFlick = this.state.isFlick

    let slides = []
    let thumbnails = []
    let bullets = []

    this.props.items.map((item, index) => {
      const alignment = this._getAlignmentClassName(index)
      const originalClass = item.originalClass ? ' ' + item.originalClass : ''
      const thumbnailClass = item.thumbnailClass ? ' ' + item.thumbnailClass : ''
      const slideStyle = Object.assign(
        this._getSlideStyle(index) || {}, this.state.style)

      const slide = (
        <div
          key={index}
          className={'image-gallery-slide' + alignment + originalClass}
          style={slideStyle}
          onClick={this._wrapClick(this.props.onClick)}
          onTouchStart={this.props.onClick}
          onTouchEnd={this._touchEnd.bind(this)}
        >
          <img
            className={this.props.server ? 'loaded' : null}
            src={item.original}
            alt={item.originalAlt}
            onLoad={this._handleImageLoad}
            onError={this._handleImageError}
          />
          {
            item.description &&
              <span className='image-gallery-description'>
                {item.description}
              </span>
          }
        </div>
      )

      if (this.props.lazyLoad) {
        if (alignment) {
          slides.push(slide)
        }
      } else {
        slides.push(slide)
      }

      if (this.props.showThumbnails) {
        thumbnails.push(
          <a
            onMouseOver={this._handleMouseOverThumbnails.bind(this, index)}
            onMouseLeave={this._handleMouseLeaveThumbnails.bind(this, index)}
            key={index}
            className={
              'image-gallery-thumbnail' +
              (currentIndex === index ? ' active' : '') +
              thumbnailClass
            }

            onTouchStart={this.slideToIndex.bind(this, index)}
            onTouchEnd={this._touchEnd.bind(this)}
            onClick={this._wrapClick(this.slideToIndex.bind(this, index))}>

            <img
              src={item.thumbnail}
              alt={item.thumbnailAlt}
              onError={this._handleImageError}/>
          </a>
        )
      }

      if (this.props.showBullets) {
        bullets.push(
          <li
            key={index}
            className={
              'image-gallery-bullet ' + (
                currentIndex === index ? 'active' : '')}

            onTouchStart={this.slideToIndex.bind(this, index)}
            onTouchEnd={this._touchEnd.bind(this)}
            onClick={this._wrapClick(this.slideToIndex.bind(this, index))}>
          </li>
        )
      }
    })

    return (
      <section ref={i => this._imageGallery = i} className='image-gallery'>
        <div
          onMouseOver={this._handleMouseOver.bind(this)}
          onMouseLeave={this._handleMouseLeave.bind(this)}
          className='image-gallery-content'>
          {
            this._hasMinSlidesToShowNav() ?
              [
                this.props.showNav &&
                  [
                    <a
                      key='leftNav'
                      className='image-gallery-left-nav'
                      onTouchStart={swipePrev}
                      onTouchEnd={this._touchEnd.bind(this)}
                      onClick={this._wrapClick(swipePrev)}/>,
                    <a
                      key='rightNav'
                      className='image-gallery-right-nav'
                      onTouchStart={swipeNext}
                      onTouchEnd={this._touchEnd.bind(this)}
                      onClick={this._wrapClick(swipeNext)}/>
                  ],
                <Swipeable
                  className='image-gallery-swipe'
                  key='swipeable'
                  onSwipingLeft={swipingNext}
                  onSwipingRight={swipingPrev}
                  onSwiped={this._handleOnSwiped.bind(this)}
                  onSwipedLeft={offsetPercentage > 30 || isFlick ? swipeNext : this.slideToIndex.bind(this, currentIndex)}
                  onSwipedRight={offsetPercentage > 30 || isFlick ? swipePrev : this.slideToIndex.bind(this, currentIndex)}
                >
                  <div className='image-gallery-slides'>
                    {slides}
                  </div>
                </Swipeable>
              ]
            :
              <div className='image-gallery-slides'>
                {slides}
              </div>
          }
          {
            this.props.showBullets &&
              <div className='image-gallery-bullets'>
                <ul className='image-gallery-bullets-container'>
                  {bullets}
                </ul>
              </div>
          }
          {
            this.props.showIndex &&
              <div className='image-gallery-index'>
                <span className='image-gallery-index-current'>
                  {this.state.currentIndex + 1}
                </span>
                <span className='image-gallery-index-separator'>
                  {this.props.indexSeparator}
                </span>
                <span className='image-gallery-index-total'>
                  {this.props.items.length}
                </span>
              </div>
          }
        </div>

        {
          this.props.showThumbnails &&
            <div className='image-gallery-thumbnails'>
              <div
                ref={t => this._thumbnails = t}
                className='image-gallery-thumbnails-container'
                style={thumbnailStyle}>
                {thumbnails}
              </div>
            </div>
        }
      </section>
    )
  }

}

ImageGallery.propTypes = {
  items: React.PropTypes.array.isRequired,
  showThumbnails: React.PropTypes.bool,
  showBullets: React.PropTypes.bool,
  showNav: React.PropTypes.bool,
  showIndex: React.PropTypes.bool,
  indexSeparator: React.PropTypes.string,
  autoPlay: React.PropTypes.bool,
  lazyLoad: React.PropTypes.bool,
  slideInterval: React.PropTypes.number,
  onSlide: React.PropTypes.func,
  onClick: React.PropTypes.func,
  startIndex: React.PropTypes.number,
  defaultImage: React.PropTypes.string,
  disableThumbnailScroll: React.PropTypes.bool,
  slideOnThumbnailHover: React.PropTypes.bool,
  server: React.PropTypes.bool
}

ImageGallery.defaultProps = {
  lazyLoad: true,
  showThumbnails: true,
  showNav: true,
  showBullets: false,
  showIndex: false,
  indexSeparator: ' / ',
  autoPlay: false,
  disableThumbnailScroll: false,
  server: false,
  slideOnThumbnailHover: false,
  slideInterval: 4000,
  startIndex: 0
}
