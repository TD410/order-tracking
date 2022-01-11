import { ReactElement } from 'react';
import { Pagination } from "react-bootstrap";

export type OrderPaginationProps = {
  currentPage: number,
  maxPage: number,
  onPageChange: Function
}

const OrderPagination = ({currentPage, maxPage, onPageChange}: OrderPaginationProps): ReactElement => {
  
  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
      <Pagination.Item active disabled>{currentPage + ' / ' + maxPage}</Pagination.Item>
      <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === maxPage}/>
      <Pagination.Last onClick={() => onPageChange(maxPage)} disabled={currentPage === maxPage}/>
    </Pagination>
  )
}

export default OrderPagination;