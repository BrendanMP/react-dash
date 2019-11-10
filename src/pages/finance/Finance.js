import React, {Component} from 'react';

import FINANCE_JSON from '../../data/finance/finance';

class Finance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: FINANCE_JSON,
      page: 0,
    }
  }

  _changeView(e, value) {
    this.setState({page: value})
  }

  render() {
    const {
      data,
      page,
    } = this.state;

    return (
      <div className='finance-dashboard'>
        <nav className='nav nav--icons'>
          <ul>
            <li className={'active'}>
              <a href="#" className={ this.state.page == 0 ? 'active' : '' }>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <title>round-dollar</title>
                  <g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" transform="translate(0.5 0.5)">
                    <circle fill="none" strokeMiterlimit="10" cx="16" cy="16" r="15"></circle>
                    <line data-color="color-2" fill="none" strokeMiterlimit="10" x1="16" y1="6" x2="16" y2="26"></line>
                    <path data-color="color-2" fill="none" strokeMiterlimit="10"
                          d="M21,10 c-2.273-1.181-9.574-2.072-9.574,1.992c0,4.865,9.091,3.148,9.091,7.441s-5.909,3.971-10,2.576"></path>
                  </g>
                </svg>
              </a>
            </li>
            <li>
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>road-2</title>
                  <g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" transform="translate(0.5 0.5)">
                    <line fill="none" strokeMiterlimit="10" x1="1" y1="30" x2="10" y2="2"
                          strokeLinecap="butt"></line>
                    <line fill="none" strokeMiterlimit="10" x1="22" y1="2" x2="31" y2="30"
                          strokeLinecap="butt"></line>
                    <line data-color="color-2" fill="none" strokeMiterlimit="10" x1="16" y1="5" x2="16" y2="8"></line>
                    <line data-color="color-2" fill="none" strokeMiterlimit="10" x1="16" y1="13" x2="16"
                          y2="17"></line>
                    <line data-color="color-2" fill="none" strokeMiterlimit="10" x1="16" y1="22" x2="16"
                          y2="27"></line>
                  </g>
                </svg>
              </a>
            </li>
            <li>
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <title>boat-front</title>
                  <g strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" transform="translate(0.5 0.5)">
                    <line fill="none" strokeMiterlimit="10" x1="16" y1="13" x2="16" y2="25"
                          strokeLinecap="butt"></line>
                    <path data-color="color-2" fill="none" strokeMiterlimit="10"
                          d="M1,27 c0,2.209,1.791,4,4,4c1.518,0,2.822-0.855,3.5-2.101C9.178,30.145,10.482,31,12,31s2.822-0.855,3.5-2.101 C16.178,30.145,17.482,31,19,31s2.822-0.855,3.5-2.101C23.178,30.145,24.482,31,26,31c2.209,0,4-1.791,4-4"></path>
                    <polyline data-color="color-2" fill="none" strokeMiterlimit="10"
                              points=" 13,8 13,1 19,1 19,8 "></polyline>
                    <polyline fill="none" strokeMiterlimit="10" points="7,18.25 7,8 25,8 25,18.25 "
                              strokeLinecap="butt"></polyline>
                    <polyline fill="none" strokeMiterlimit="10"
                              points="6,26 4,20 16,13 28,20 26,26 "></polyline>
                  </g>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
        <nav className='nav nav--list'>
          <ul>
            <li>
              <a href="#" onClick={e => this._changeView(e, 0)}>Propriétés</a>
            </li>
            <li>
              <a href="#" onClick={e => this._changeView(e, 1)}>Propriétés</a>
            </li>
            <li>
              <a href="#" onClick={e => this._changeView(e, 2)}>Propriétés</a>
            </li>
            <li>
              <a href="#" onClick={e => this._changeView(e, 3)}>Propriétés</a>
            </li>
          </ul>
        </nav>
        <main>
          <section className={this.state.page == 0 ? 'active' : ''}>
            <header>
              <h1>Header</h1>
            </header>
            <article>
              <div className="row">
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      1
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      2
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      3
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      4
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
          <section className={this.state.page == 1 ? 'active' : ''}>
            <header>
              <h1>Header</h1>
            </header>
            <article>
              <div className="row">
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      1
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      2
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      3
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      4
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
          <section className={this.state.page == 2 ? 'active' : ''}>
            <header>
              <h1>Header</h1>
            </header>
            <article>
              <div className="row">
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      1
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      2
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      3
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      4
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
          <section className={this.state.page == 3 ? 'active' : ''}>
            <header>
              <h1>Header</h1>
            </header>
            <article>
              <div className="row">
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      1
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      2
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      3
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="panel d-flex flex-row">
                    <div className="panel-rank">
                      4
                    </div>
                    <div className="panel-body">
                      <h2>Test</h2>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, possimus.
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    )
  }
}

export default Finance