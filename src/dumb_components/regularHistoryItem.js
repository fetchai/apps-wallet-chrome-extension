import React, { Component } from 'react'
import { format } from '../utils/format'
import { toLocaleDateString } from '../utils/toLocaleDateString'

/**
 * Represents a item in history as is shown to the user in the accounts and history (infinite scroll) section.
 *
 */
export default class RegularHistoryItem extends Component {

  constructor (props) {
    super(props)

    // eslint-disable-next-line react/prop-types
    const { index, created_date, clicked, digest, status, toggle_clicked } = props

    this.state = {
      digest: digest,
      status: status,
      created_date: created_date,
      clicked: clicked,
      index: index,
      toggle_clicked: toggle_clicked
    }
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
        className="history_left_value">{format(this.state.digest, 10)}</span><span
        className="history_right_value">-200</span><br></br>
        <span className="history_left_value light">{this.state.status}</span><span
          className="history_right_value light">{toLocaleDateString(this.state.created_date)}</span>
      </div>
    )
  }
}