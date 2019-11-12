import React from 'react'
import {addSeconds, format} from 'date-fns';
import InputRange from 'react-input-range';

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.time,
      interval: null,
      date: new Date('2019-10-10 0:00'),
      isPlaying: false,
    };
    this.updateRange = this.updateRange.bind(this);
    this._play = this._play.bind(this);
  }

  updateRange(value) {
    this.setState({
      value
    })
    this.props.rangeChange(value);
  }

  _play = () => {
    if (this.state.value < 86400) {
      this.updateRange(this.state.value + (this.props.speed || 5))
    } else {
      this.updateRange(0)
    }

    if (!this.isPlaying) {
      this.setState({isPlaying: true})
      this._animationFrame = window.requestAnimationFrame(this._play.bind(this));
    } else {
      this.setState({isPlaying: false})
      this._animationFrame = null;
    }
  }

  render() {
    return (
      <div className='d-flex flex-grow-1 align-content-center'>
        <div className='mr-4'>
          <button className="btn" onClick={this._play}>Play</button>
        </div>
        <div className='flex-grow-1 d-flex align-items-center'>
          <InputRange
            formatLabel={value => format(addSeconds(this.state.date, value || 0), 'h:mm a')}
            minValue={0}
            maxValue={86400}
            value={this.state.value}
            onChange={value => this.updateRange(value)}
          />
        </div>
      </div>
    )
  }
}

export default RangeSlider