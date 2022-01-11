import React, { ReactElement, useState } from 'react';
import { Button, Accordion, ListGroup } from 'react-bootstrap';
import fetch from '../services/mock-api';

export type OrderItemProps = {
  id: number,
  status: OrderStatus,
  customerName: string,
  riderName: string,
  orderAddress: string,
  merchantName: string,
  merchantAddress: string,
  dishes: Array<DishItemProps>,
  totalPrice: number,
  updatedTime: Date
}

type DishItemProps = {
  name: string,
  price: number
}

export enum OrderStatus {
  CREATED = "Created",
  ACCEPTED = "Accepted",
  DRIVER_ASSIGNED = "DriverAssigned",
  DELIVERING = "Delivering",
  DONE = "Done",
  CANCELLED = "Cancelled"
}

enum OrderLateStatus {
  NORMAL,
  WARN,
  LATE
}

const OrderItem = (props: OrderItemProps): ReactElement => {
  const [status, setStatus] = useState(props.status);
  const formatter = new Intl.NumberFormat();

  const assignToMe = () => {
    if (status !== OrderStatus.DONE && status !== OrderStatus.CANCELLED) {
      fetch(`/cancelOrder?id=${props.id}`)
      .then(repsonse => {
        setStatus(OrderStatus.CANCELLED);
      })
    }
  }

  const getLateStatus = (): string => {

    let lateStatus = OrderLateStatus.NORMAL;
    let lateMinutes = 0;
    if (props.status !== OrderStatus.DONE && props.status !== OrderStatus.CANCELLED) {
      let MILISECOND_PER_MINUTE = 60000;
      let lateTime = Date.now() - new Date(props.updatedTime).getTime();
      lateMinutes = Math.floor(lateTime / MILISECOND_PER_MINUTE);
      
      if (props.status === OrderStatus.DELIVERING) {
        lateStatus = lateMinutes >= 40 ? OrderLateStatus.LATE : 
        (lateMinutes >= 30 ? OrderLateStatus.WARN : OrderLateStatus.NORMAL);
      } else {
        lateStatus = lateMinutes >= 15 ? OrderLateStatus.LATE : 
        (lateMinutes >= 10 ? OrderLateStatus.WARN : OrderLateStatus.NORMAL);
      }
    }

    switch (lateStatus) {
      case OrderLateStatus.LATE:
        return `❌ Late`;
      case OrderLateStatus.WARN:
        return `⚠ Warning`;
      case OrderLateStatus.NORMAL:
        return '';
    }
  } 

  return (
    <React.Fragment>
      <tr>
        <td>{props.id}</td>
        <td>{status}<br/><div>{getLateStatus()}</div></td>
        <td>{props.customerName}</td>
        <td>{props.riderName}</td>
        <td>{props.orderAddress}</td>
        <td>{props.merchantName}</td>
        <td>{props.merchantAddress}</td>
        <td>{formatter.format(props.totalPrice) + '₫'}</td>
        <td>{new Date(props.updatedTime).toLocaleString()}</td>
        <td>
          <Button
            disabled={status === OrderStatus.DONE || status === OrderStatus.CANCELLED}
            onClick={assignToMe}>Assign</Button>
          </td>
      </tr>
      <tr>
        <td colSpan={10}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Dishes</Accordion.Header>
            <Accordion.Body>
            <ListGroup variant="flush">
            {
              props.dishes.map((dish: DishItemProps) => (
                <ListGroup.Item key={dish.name}>
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">{formatter.format(dish.price) + '₫'}</span>
                </ListGroup.Item>
              ))
            }
            </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </td>
      </tr>
    </React.Fragment>
  )
}

export default OrderItem;