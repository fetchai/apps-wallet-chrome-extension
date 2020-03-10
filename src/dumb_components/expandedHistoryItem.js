import React, { Component } from 'react'
import { toLocaleDateString } from '../utils/toLocaleDateString'
import { format } from '../utils/format'
import { getElementById } from '../utils/getElementById'
import { toNonCanonicalFet } from '../utils/toNonCanonicalFet'

/**
 * When clicked a different history item is shown, with different extra data
 *
 */
export default class ExpandedHistoryItem extends Component {

  constructor (props) {
    super(props)

    // eslint-disable-next-line react/prop-types
    const { index, created_date, clicked, digest, status, toggle_clicked, blockexplorer_url, from_address, to_address, amount, address } = props

    this.setToolTipHeight = this.setToolTipHeight.bind(this)
    this.toOrFromListItem = this.toOrFromListItem.bind(this)

    this.state = {
      digest: digest,
      address: address,
      from_address: from_address,
      to_address: to_address,
      amount: amount,
      status: status,
      created_date: created_date,
      blockexplorer_url: blockexplorer_url,
      clicked: clicked,
      index: index,
      toggle_clicked: toggle_clicked,
      css: null
    }
  }

  toOrFromListItem(){
    if(this.state.to_address === this.state.address) return <li><span>From: </span>{format(this.state.from_address, 9)}</li>
    else return  <li><span>To: </span>{format(this.state.to_address, 9)}</li>
}

  setToolTipHeight(event){
      event.stopPropagation()
     const element = event.target
    const bounding_client_rect = element.getBoundingClientRect()
    const tooltip = getElementById(`tooltip-${this.state.index}`)
    let top = bounding_client_rect.top
     top = top -5
     tooltip.style.top = `${top}px`;
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    // eslint-disable-next-line react/prop-types
    if (nextProps.clicked !== this.props.clicked) {
      // eslint-disable-next-line react/prop-types
      this.setState({ clicked: nextProps.clicked })
    }
  }

  render () {
    return (<div className={`history_item large_history_item history-pointer ${this.state.clicked ? '' : 'hide'}`}
                 onClick={(event) => { this.state.toggle_clicked(event, this.state.index)}}>
      <ul className={'large-history-item-list'}>
        <li><span
                  className="hoverable-expanded-history-item"
                onMouseEnter={this.setToolTipHeight}>
                 {/*<a className='expanded-history-link'  target="_blank" rel="noopener noreferrer" href={`${this.state.blockexplorer_url}${this.state.digest}`}>*/}
               Hash: {format(this.state.digest, 10)}
              {/*</a>*/}
              </span>
                <span
                  id={`tooltip-${this.state.index}`}
                  className={`tooltiptext tooltiptext-expanded-history-item-positioning ${(this.state.css !== null)? this.state.css : "" }`}>View on BlockExplorer</span>
         </li>
        {this.toOrFromListItem()}
        {/*<li><span>Fee: </span>{this.state.fee}</li>*/}
        <li><span>Time: </span>{toLocaleDateString(this.state.created_date)}</li>
        <li><span>Amount: </span><span  className={this.state.amount.isNeg()? "red" : "green"}>{this.state.amount.isNeg()? "" : "+"}{toNonCanonicalFet(this.state.amount).toString(10)}</span><span className={'expanded-history-item-status'}> {this.state.status}</span></li>
      </ul>
    </div>)
  }
}