import { ReactElement } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { OrderStatus } from './OrderItem';

export type OrderFilterProps = {
  id: string,
  status: string
  customerName: string,
  riderName: string,
  merchantName: string,
  updatedTime: string,
  onFilterChange: Function
}

const OrderFilter = (props: OrderFilterProps): ReactElement => {

  const MILISECOND_PER_MINUTE = 60000;

  return (
    <tr>
      <td><FormControl onChange={(e) => { props.onFilterChange({id: e.target.value}) }} placeholder="Search"/></td>
      <td>
        <Form.Select onChange={(e) => { props.onFilterChange({status: e.target.value}) }}>
          <option value=''>All</option>
          {
            Object.values(OrderStatus).map((status) => <option key={status} value={status}>{status}</option>)
          }
        </Form.Select>
      </td>
      <td><FormControl onChange={(e) => { props.onFilterChange({customerName: e.target.value}) }} placeholder="Search"/></td>
      <td><FormControl onChange={(e) => { props.onFilterChange({riderName: e.target.value}) }} placeholder="Search"/></td>
      <td></td>
      <td><FormControl onChange={(e) => { props.onFilterChange({merchantName: e.target.value}) }} placeholder="Search"/></td>
      <td></td>
      <td></td>
      <td><Form.Select onChange={(e) => { props.onFilterChange({updatedTime: e.target.value}) }}>
          <option value=''>All</option>
          <option value={Date.now() - MILISECOND_PER_MINUTE * 5}>Last 5 minutes</option>
          <option value={Date.now() - MILISECOND_PER_MINUTE * 10}>Last 10 minutes</option>
          <option value={Date.now() - MILISECOND_PER_MINUTE * 15}>Last 15 minutes</option>
        </Form.Select></td>
      <td></td>
    </tr>
  )
}

export default OrderFilter;