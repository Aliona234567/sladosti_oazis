import React, { Component } from 'react'
import Item from './Item'
import './Items.module.css';

export class Items extends Component {
  render() {
    return (
      <div className="items-container">
        {this.props.items.map(el => (
          <div className="item" key={el.id}>
            <Item 
              onShowItem={this.props.onShowItem} 
              item={el} 
              onAdd={this.props.onAdd}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default Items