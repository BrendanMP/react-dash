import React from 'react'
import InputRange from 'react-input-range';

const ANIMATION_SPEED = 30;

class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        min: 0,
        max: 50
      },
      isPlaying: false,
    };
    this._updateRange = this._updateRange.bind(this);
    this._animationFrame = null;
  }

  _updateRange(value) {
    this.setState({
      value
    })
  }


  render() {
    const {min, max} = this.props.value;
    return (
      <div className='d-flex flex-grow-1 align-content-center'>
        <div className='mr-4'>
          <button className="btn" onClick={this._animate}>Play</button>
        </div>
        <div className='flex-grow-1 d-flex align-items-center'>
          <InputRange
            minValue={0}
            maxValue={100}
            value={this.state.value}
            onChange={value => this._updateRange(value)}
          />
        </div>
      </div>
    )
  }
}

export default RangeSlider