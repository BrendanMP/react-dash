import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      options: props.options,
    }
  }

  static defaultProps = {
    options: {
      maintainAspectRatio: true,
      tooltips: {
        mode: 'label',
        displayColors: false,
        callbacks:  {
          label: function(item, data) {
            return `${data.datasets[item.datasetIndex].label}: ${item.value}`;
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  }

  _makeGradient(gradient, bg) {
    if (!bg) bg = [255,0,0];
    const rgb = `${bg[0]}, ${bg[1]}, ${bg[2]}`;
    gradient.addColorStop(0, `rgba(${rgb}, 0.7)`);
    gradient.addColorStop(0.5, `rgba(${rgb}, 0.5)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0)`);
    return gradient
  }

  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext('2d');
      const height = canvas.parentNode.clientHeight + (canvas.parentNode.clientHeight / 2);
      return {
        ...this.state.data,
        datasets: this.state.data.datasets.map(data => {
          const gradient = ctx.createLinearGradient(0,0,0, height);
          data.backgroundColor = this._makeGradient(gradient, data.backgroundColor);
          return data
        })
      }
    }

    return (
      <div className='chart-wrapper'>
        <Bar data={data} options={this.state.options}/>
      </div>
    )
  }
}

export default BarChart