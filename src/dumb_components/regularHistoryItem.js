import React, { Component } from 'react'
import { format } from '../utils/format'
import { toLocaleDateString } from '../utils/toLocaleDateString'
import { toNonCanonicalFetDisplay } from '../utils/toNonCanonicalFetDisplay'
import { getElementById } from '../utils/getElementById'

/**
 * Represents a item in history as is shown to the user in the accounts and history (infinite scroll) section.
 *
 */
export default class RegularHistoryItem extends Component {

  constructor (props) {
    super(props)
    this.setToolTipHeight = this.setToolTipHeight.bind(this)
    this.viewOnBlockExplorer = this.viewOnBlockExplorer.bind(this)

    // eslint-disable-next-line react/prop-types
    const { index, created_date, clicked, digest, status, toggle_clicked, amount } = props

    this.state = {
      // eslint-disable-next-line react/prop-types
      block_explorer_url: props.block_explorer_url,
      digest: digest,
      amount: amount,
      status: status,
      created_date: created_date,
      clicked: clicked,
      index: index,
      toggle_clicked: toggle_clicked
    }
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
    const tooltip = getElementById(`regular-tooltip-${this.state.index}`)
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
    return (
      <div className={`history_item history-pointer ${this.state.clicked ? 'hide' : ''}`}
           onClick={(event) => { this.state.toggle_clicked(event, this.state.index)}}><span
        className="history_left_value hoverable-expanded-history-item" onClick={this.viewOnBlockExplorer} onMouseEnter={this.setToolTipHeight} >{format(this.state.digest, 10)}</span>
        <span
                  id={`regular-tooltip-${this.state.index}`}
                  className={`tooltiptext tooltiptext-expanded-history-item-positioning`}>View on BlockExplorer</span>
        <span
        className={`history_right_value ${this.state.amount.isNeg()? "red" : "green"}`}>{toNonCanonicalFetDisplay(this.state.amount)}</span><br></br>
        <span className="history_left_value light">{this.state.status}</span><span
          className="history_right_value light">{toLocaleDateString(this.state.created_date)}</span>
      </div>
    )
  }
}