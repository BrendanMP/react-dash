import React from 'react'
import {addSeconds, format} from 'date-fns';
import InputRange from 'react-input-range';

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.time,
      date: new Date('2019-10-10 0:00'),
      isPlaying: false,
    };
    this._updateRange = this._updateRange.bind(this);
    this._animate = this._animate.bind(this);
    this._toggle = this._toggle.bind(this);
    this._animationFrame = null;
  }

  _updateRange(value) {
    this.setState({
      value
    })
    this.props.rangeChange(value);
  }

  _animate = () => {
    if (this.state.value < 86400) {
      this._updateRange(this.state.value + (this.props.speed || 1))
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

  render() {
    const {isPlaying} = this.state;
    return (
      <div className='d-flex flex-grow-1 align-content-center'>
        <div className='mr-4'>
          <button className="btn" onClick={this._toggle}>
            { !isPlaying ?
              <div>Play</div>
              :
              <div>Pause</div>
            }
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