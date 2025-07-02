import React, { Component } from 'react'
import { TiDeleteOutline } from "react-icons/ti";
import './Order.module.css';


export class Order extends Component {
  render() {
    return (<>

      <div className='item'>

        <img src={'./img/'+ this.props.item.img}/>
        <h2>{this.props.item.title}</h2>
        <p>{this.props.item.desc}</p>
        <p className='mini'>Состав</p>
        <p className='mini'>{this.props.item.opis}</p>
        
        <b>{this.props.item.price}</b>
        <TiDeleteOutline  className='delete-icon' onClick={() => this.props.onDelete(this.props.item.id)}/>

      </div></>
    )
  }
}

export default Order
