import React from 'react'
import {addSeconds, format} from 'date-fns';
import InputRange from 'react-input-range';
import { ReactComponent as Play } from '../images/play.svg';
import { ReactComponent as Pause } from '../images/pause.svg';

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.time,
      date: new Date('2019-10-10 0:00'),
      isPlaying: false,
      speed: this.props.speed,
      speedModifier: 1,
    };
    this._updateRange = this._updateRange.bind(this);
    this._animate = this._animate.bind(this);
    this._toggle = this._toggle.bind(this);
    this._toggleSpeed = this._toggleSpeed.bind(this);
    this._animationFrame = null;
  }

  _updateRange(value) {
    this.setState({value})
    this.props.rangeChange(value);
  }

  _animate = () => {
    if (this.state.value < 86400) {
      this._updateRange(this.state.value + (this.state.speed * this.state.speedModifier || 1))
    } else {
      this._updateRange(0)
    }
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _toggle() {
    cancelAnimationFrame(this._animationFrame);
    const {isPlaying} = this.state;
    if (!isPlaying) {
      this._animate();
    }
    this.setState({isPlaying: !isPlaying});
  }

  _toggleSpeed() {
    if (this.state.speedModifier === 1) {
      this.setState({speedModifier: 2})
    } else {
      this.setState({speedModifier: 1})
    }
  }

  render() {
    const {isPlaying} = this.state;
    return (
      <div className='d-flex flex-grow-1 align-content-center'>
        <div className='mr-0'>
          <button className="btn px-0" onClick={this._toggle}>
            { !isPlaying ?
              <div><Play/></div>
              :
              <div><Pause/></div>
            }
          </button>
          <button className='btn mx-4' onClick={this._toggleSpeed}>
            {this.state.speedModifier}x
          </button>
        </div>
        <div className='flex-grow-1 d-flex align-items-center'>
          <InputRange
            formatLabel={value => format(addSeconds(this.state.date, value || 0), 'h:mm a')}
            minValue={0}
            maxValue={86400}
            value={this.state.value}
            onChange={value => this._updateRange(value)}
          />
        </div>
      </div>
    )
  }
}

export default RangeSlider