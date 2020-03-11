import React, { Component } from 'react'
import { toLocaleDateString } from '../utils/toLocaleDateString'
import { format } from '../utils/format'
import { getElementById } from '../utils/getElementById'
import { toNonCanonicalFetDisplay } from '../utils/toNonCanonicalFetDisplay'

/**
 * When clicked a different history item is shown, with different extra data
 *
 */
export default class ExpandedHistoryItem extends Component {

  constructor (props) {
    super(props)

    // eslint-disable-next-line react/prop-types
    const { index, created_date, clicked, digest, status, toggle_clicked, block_explorer_url, from_address, to_address, amount, address } = props

    this.setToolTipHeight = this.setToolTipHeight.bind(this)
    this.toOrFromListItem = this.toOrFromListItem.bind(this)
    this.viewOnBlockExplorer = this.viewOnBlockExplorer.bind(this)

    this.state = {
      block_explorer_url: block_explorer_url,
      digest: digest,
      address: address,
      from_address: from_address,
      to_address: to_address,
      amount: amount,
      status: status,
      created_date: created_date,
      clicked: clicked,
      index: index,
      toggle_clicked: toggle_clicked
    }
  }

  /**
   *sreturns  li  as either to or from depening on if we are recieving or sending.
   */
  toOrFromListItem(){
    if(this.state.to_address === this.state.address) return <li><span>From: </span> <span className="history-item-blue">{format(this.state.from_address, 9)} </span></li>
    else return  <li><span>To: </span><span className="history-item-blue">{format(this.state.to_address, 9)}</span></li>
}


viewOnBlockExplorer(){
     let link=document.createElement("a");
      link.href=this.state.block_explorer_url + this.state.digest;
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click();
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
                onMouseEnter={this.setToolTipHeight}
              onClick={this.viewOnBlockExplorer}>
          Hash: <span className="history-item-blue">{format(this.state.digest, 10)}</span>
              </span>
                <span
                  id={`tooltip-${this.state.index}`}
                  className={`tooltiptext tooltiptext-expanded-history-item-positioning`}>View on BlockExplorer</span>
         </li>
        {this.toOrFromListItem()}
        <li><span>Time: </span>{toLocaleDateString(this.state.created_date)}</li>
        <li><span>Amount: </span><span  className={this.state.amount.isNeg()? "red" : "green"}>{toNonCanonicalFetDisplay(this.state.amount)}{" FET"}</span><span className={'expanded-history-item-status'}>{this.state.status}</span></li>
      </ul>
    </div>)
  }
}