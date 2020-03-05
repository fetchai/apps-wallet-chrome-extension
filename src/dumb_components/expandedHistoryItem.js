import React, { Component } from 'react'
import { toLocaleDateString } from '../utils/toLocaleDateString'
import { blockExplorerURL } from '../utils/blockExplorerURL'
import { format } from '../utils/format'
import { COPIED_MESSAGE, COPY_ADDRESS_TO_CLIPBOARD_MESSAGE } from '../constants'
import { getElementById } from '../utils/getElementById'

/**
 * When clicked a different history item is shown, with different extra data
 *
 */
export default class ExpandedHistoryItem extends Component {

  constructor (props) {
    super(props)

    // eslint-disable-next-line react/prop-types
    const { index, created_date, clicked, digest, status, toggle_clicked, blockexplorer_url } = props

    this.setToolTipHeight = this.setToolTipHeight.bind(this)

    this.state = {
      digest: digest,
      status: status,
      created_date: created_date,
      blockexplorer_url: blockexplorer_url,
      clicked: clicked,
      index: index,
      toggle_clicked: toggle_clicked,
      css: null
    }
  }


  setToolTipHeight(event){
      event.stopPropagation()
     const element = event.target
    const bounding_client_rect = element.getBoundingClientRect()
    const tooltip = getElementById(`tooltip-${this.state.index}`)
    let top = bounding_client_rect.top
     top = top -5
     debugger;
     tooltip.style.top = `${top}px`;
    debugger;
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
        <li><span>To: </span> this.state.status</li>
        <li><span>Fee: </span>{this.state.fee}</li>
        <li><span>Time: </span>{toLocaleDateString(this.state.created_date)}</li>
        <li><span>Amount: </span><span>-999</span> <span className={'expanded-history-item-status'}> {this.state.status}</span></li>

      </ul>
    </div>)
  }
}