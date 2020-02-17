import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
import {ACCOUNT_HISTORY_URI, NETWORK_NAME} from "../constants";

export default class History extends Component {

    constructor(props) {
        super(props)

          this.state = {
          address: props.address,
          items: 20,
          hasMoreItems: true
        };
    }

      async componentDidMount() {

      }


       fetchHistory(page_number){
    fetch(ACCOUNT_HISTORY_URI + "&page=" + page_number)
        .then((response) => response.json())
        .then((result) => {

            this.setState({count: result.count})
            const results = result.results.map(el => {el.})

        })
    }

    showItems() {
        const items = [];
        for (let i = 0; i < this.state.items; i++) {
          items.push(<li key={i}> Item {i} </li>);
        }
        return items;
      }

      loadMore() {
        if(this.state.items===200){

          this.setState({ hasMoreItems: false});
        }else{
            setTimeout(() => {
            this.setState({ items: this.state.items + 20});
        }, 2000);
        }

      }

          render() {
        return (
            <div style={{height:'400px', overflow:'auto'}}>
              <InfiniteScroll
                loadMore={this.loadMore.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<div className="loader"> Loading... </div>}
                useWindow={false}
              >
                {this.showItems()}{" "}
              </InfiniteScroll>{" "}
            </div>
        );
      }


}