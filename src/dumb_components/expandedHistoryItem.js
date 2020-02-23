import React, { Component } from 'react'
import { toLocaleDateString } from '../utils/toLocaleDateString'

/**
 * When clicked a different history item is shown, with different extra data
 *
 */
export default class ExpandedHistoryItem extends Component {

            constructor (props)
       {
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

  UNSAFE_componentWillReceiveProps(nextProps){
                       // eslint-disable-next-line react/prop-types
  if(nextProps.clicked!==this.props.clicked){
    // eslint-disable-next-line react/prop-types
    this.setState({clicked: nextProps.clicked });
  }
}
       
   render ()
       {
return (<div className={`history_item large_history_item history-pointer ${this.state.clicked ? '' : 'hide'}`} onClick={(event) => { this.state.toggle_clicked(event, this.state.index)}}>
      <ul className={'large-history-item-list'}>
        <li>Digest: {this.state.digest.substring(0, 23)} <br></br>{this.state.digest.substring(23)}</li>
        <li><span>Status: </span>{this.state.status}</li>
        <li><span>Fee: </span>{this.state.fee}</li>
        <li><span>Time: </span>{toLocaleDateString(this.state.created_date)}</li>
        <li><span>Amount: </span>-999</li>
      </ul>
    </div>)
       }
}