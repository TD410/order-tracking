import { useState, useEffect, ReactElement } from 'react';
import { Container, Table } from 'react-bootstrap';
import fetch from '../services/mock-api';
import OrderFilter, { OrderFilterProps } from './OrderFilter';
import OrderItem, { OrderItemProps } from './OrderItem';
import OrderPagination from './OrderPagination';

enum OrderSort {
  UPDATED_DESCENDING = 'updated-descending',
  UPDATED_ASCENDING = 'updated-ascending',
}

const ListOrder = (): ReactElement => {
  const [orders, setOrders] = useState<Array<OrderItemProps>>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [sort, setSort] = useState(OrderSort.UPDATED_DESCENDING);
  const [filter, setFilter] = useState<OrderFilterProps>({
    id: '',
    status: '',
    customerName: '',
    riderName: '',
    merchantName: '',
    updatedTime: '',
    onFilterChange: () => {}
  });
  
  useEffect(() => { 
    let filterParam = new URLSearchParams(JSON.parse(JSON.stringify(filter)));
    fetch(`/getOrders?page=${page}&sort=${sort}&${filterParam.toString()}`)
    .then(repsonse => {
      let data = JSON.parse(repsonse);
      setOrders(data.orders);
      setMaxPage(data.maxPage);
    })
  }, [page, sort, filter]);

  const onPageChange = (page: number) => {
    setPage(page);
  }

  const onFilterChange = (param: object) => {
    let newFilter = {...filter, ...param};
    setFilter(newFilter);
  }

  const onSortChange = () => {
    let newSort = sort === OrderSort.UPDATED_DESCENDING ? OrderSort.UPDATED_ASCENDING : OrderSort.UPDATED_DESCENDING;
    setSort(newSort);
    setPage(1);
  }

  return (
    <Container fluid>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Id</th>
            <th>Status</th>
            <th>Customer name</th>
            <th>Rider name</th>
            <th>Order address</th>
            <th>Merchant name</th>
            <th>Merchant address</th>
            <th>Total price</th>
            <th className="sort-col" onClick={onSortChange}>
              <span>Updated time</span>
              <span>{sort === OrderSort.UPDATED_DESCENDING ? ' 🠗': ' 🠕'}</span>
            </th>
            <th>Assign to me</th>
          </tr>
        </thead>
        <tbody>
          <OrderFilter {...filter} onFilterChange={onFilterChange} />
          { 
            orders.map((order: OrderItemProps) => {
              return (
                <OrderItem key={order.id} {...order} />
              )
            })
          }
        </tbody>
      </Table>
      <OrderPagination currentPage={page} maxPage={maxPage} onPageChange={onPageChange} />
    </Container>
  )
}

export default ListOrder;