import React from 'react'
import ReactDOM from 'react-dom'

import ImageGallery from '../src/ImageGallery.react'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      isPlaying: false,
      showIndex: false,
      slideOnThumbnailHover: false,
      showBullets: true,
      showThumbnails: true,
      showNav: true,
      slideInterval: 4000
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval) {
      // refresh setInterval
      this._pauseSlider()
      this._playSlider()
    }
  }

  _pauseSlider() {
    if (this._imageGallery) {
      this._imageGallery.pause()
      this.setState({isPlaying: false})
    }
  }

  _playSlider() {
    if (this._imageGallery) {
      this._imageGallery.play()
      this.setState({isPlaying: true})
    }
  }

  _handleInputChange(state, event) {
    this.setState({[state]: event.target.value})
  }

  _handleCheckboxChange(state, event) {
    console.debug(state)
    this.setState({[state]: event.target.checked})
  }

  render() {
    const images = [
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/1.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/1t.jpg',
        originalClass: 'featured-slide',
        thumbnailClass: 'featured-thumb',
        description: 'Custom class for slides & thumbnails'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/2.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/2t.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing...'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/3.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/3t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/4.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/4t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/5.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/5t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/6.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/6t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/7.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/7t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/8.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/8t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/9.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/9t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/10.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/10t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/11.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/11t.jpg'
      },
      {
        original: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/12.jpg',
        thumbnail: 'https://raw.githubusercontent.com/xiaolin/linxtion.github.io/master/static/img/image-gallery/12t.jpg'
      }
    ]

    return (

      <section className='app'>
        <ImageGallery
          ref={i => this._imageGallery = i}
          items={images}
          lazyLoad={false}
          showBullets={this.state.showBullets}
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          slideInterval={parseInt(this.state.slideInterval)}
          autoPlay={this.state.isPlaying}
          slideOnThumbnailHover={this.state.slideOnThumbnailHover}
        />

        <div className='app-sandbox'>

          <h2> Available Props </h2>

          <ul>
            <li>
              <a
                className={'app-button ' + (this.state.isPlaying ? 'active' : '')}
                onClick={this._playSlider.bind(this)}>
                Play
              </a>
            </li>
            <li>
            <a
              className={'app-button ' + (!this.state.isPlaying ? 'active' : '')}
              onClick={this._pauseSlider.bind(this)}>
              Pause
            </a>
            </li>
            <li>
              <div>slide interval</div>
              <input
                type='text'
                placeholder='SlideInterval'
                onChange={this._handleInputChange.bind(this, 'slideInterval')}
                value={this.state.slideInterval}/>
            </li>
            <li>
              <input
                id='show_bullets'
                type='checkbox'
                onChange={this._handleCheckboxChange.bind(this, 'showBullets')}
                checked={this.state.showBullets}/>
                <label htmlFor='show_bullets'>show bullets?</label>
            </li>
            <li>
              <input
                id='show_thumbnails'
                type='checkbox'
                onChange={this._handleCheckboxChange.bind(this, 'showThumbnails')}
                checked={this.state.showThumbnails}/>
                <label htmlFor='show_thumbnails'>show thumbnails?</label>
            </li>
            <li>
              <input
                id='show_navigation'
                type='checkbox'
                onChange={this._handleCheckboxChange.bind(this, 'showNav')}
                checked={this.state.showNav}/>
                <label htmlFor='show_navigation'>show navigation?</label>
            </li>
            <li>
              <input
                id='show_index'
                type='checkbox'
                onChange={this._handleCheckboxChange.bind(this, 'showIndex')}
                checked={this.state.showIndex}/>
                <label htmlFor='show_index'>show index?</label>
            </li>
            <li>
              <input
                id='slide_on_thumbnail_hover'
                type='checkbox'
                onChange={this._handleCheckboxChange.bind(this, 'slideOnThumbnailHover')}
                checked={this.state.slideOnThumbnailHover}/>
                <label htmlFor='slide_on_thumbnail_hover'>slide on thumbnail hover?</label>
            </li>
          </ul>

        </div>
      </section>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('container'))

