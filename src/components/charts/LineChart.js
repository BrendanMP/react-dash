import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class LineChart extends Component {
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
        },
        backgroundColor: '#227799'
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

  render() {
    const data = (canvas) => {
      // const ctx = canvas.getContext('2d');
      // const height = canvas.parentNode.clientHeight + (canvas.parentNode.clientHeight / 2);

      return {
        ...this.state.data,
        // datasets: this.state.data.datasets.map(data => {
        //   const gradient = ctx.createLinearGradient(0,0,0, height);
        //   data.backgroundColor = this._makeGradient(gradient, data.backgroundColor);
        //   return data
        // })
      }
    }

    return (
      <div className='chart-wrapper'>
        <Line data={data} options={this.state.options}/>
      </div>
    )
  }
}

export default LineChart