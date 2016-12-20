import React from 'react';
import axios from 'axios';
import {VictoryPie} from 'victory-pie';
import {VictoryContainer} from 'victory-core';
import {getRelatedOuList, getDonutChartData, getToday} from './utils';
import epi from './epi';
import {DonutColor} from './config';
import css from './donut.css';


const data = {
  total: 0,
  mBes: [{status: 'completed', amount: 0},
    {status: 'incomplete', amount: 0},
    {status: 'missing', amount: 0}
  ]
};

export default class Donut extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data};
  }

  static getY(datum) {
    return datum.amount;
  }

  static getLabel() {
    return '';
  }

  static getColor(datum) {
    return DonutColor[datum.status];
  }

  componentDidMount() {
    axios.get(getRelatedOuList(), {auth: {username: 'wang@qq.com', password: 'Wang1234'}})
      .then(response => {
        const ou = response.data['organisationUnits'][0]['id'];
        const epiWeek = epi(getToday());
        axios.get(getDonutChartData(epiWeek.year, epiWeek.week, ou))
            .then(response => {
              this.setState({data: response.data})
            });
        }
      )
      .catch();
  }

  getAllMBesFacilities() {
    let total = 0;
    for (const datum of this.state.data.mBes) {
      total += datum.amount;
    }

    return total;
  }

  getAmount(status) {
    if (status === 'total') {
      return this.state.data.total;
    }

    if (status === 'mBes') {
      return this.getAllMBesFacilities();
    }

    for (const datum of this.state.data.mBes) {
      if (datum.status === status) {
        return datum.amount;
      }
    }

    throw new Error('Unknown status');
  }

  render() {
    const epiWeek = epi(getToday());
    return (
      <div>
        <h3>{`National mBES submission data for week ${epiWeek.week - 1} ${epiWeek.year }`}</h3>

        <div style={{float: 'left'}} onClick={() => console.log('clicked')}>
          <VictoryPie
            data={this.state.data.mBes}
            x="status"
            y={Donut.getY}
            style={{data: {fill: Donut.getColor}}}
            labels={Donut.getLabel}
            width={400}
            height={400}
            containerComponent={<VictoryContainer responsive={false} title="Chart of submitting status"/>}
            innerRadius={100}
          />
        </div>

        <div style={{paddingTop: '100px'}}>
          <p>
            <b><span className={css.total}>{this.getAmount('total')}</span>
              &nbsp;&nbsp;Total number of Health Facilities existent</b>
          </p>
          <p>
            <span className={css.mBes}><b>{this.getAmount('mBes')}</b></span>
            &nbsp;&nbsp;Health facilities are using the mBES system
          </p>
          <p>
            <span className={css.completed}><b>{this.getAmount('completed')}</b></span>
            &nbsp;&nbsp;Health facilities have submitted their completed mBES
          </p>
          <p>
            <span className={css.incomplete}><b>{this.getAmount('incomplete')}</b></span>
            &nbsp;&nbsp;Health facilities have submitted an incomplete mBES
          </p>
          <p><span className={css.missing}><b>{this.getAmount('missing')}</b></span>
            &nbsp;&nbsp;Health facilities have not submitted their mBES
          </p>
        </div>
      </div>
    );
  }
}
