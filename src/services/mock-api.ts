import mockData from './mock-data.json';

const generateData = () => {
  let dataWithNewDate = {...mockData};
  let MILISECOND_PER_MINUTE = 60000;

  dataWithNewDate.orders.forEach(order => {
    let randomMinutes = Math.floor(Math.random() * (60 - 1 + 1)) + 1;
    let randomTime = new Date(Date.now() - MILISECOND_PER_MINUTE * randomMinutes);
    order.updatedTime = randomTime.toString();
  })

  return dataWithNewDate;
}

let data = generateData();

const fetch = async (url: string) => {
  let path: string = url.split('?')[0];
  let params: URLSearchParams = new URLSearchParams(url.split('?')[1]);

  switch (path) {
    case "/getOrders":
      return Promise.resolve(getOrders(params));
    case "/cancelOrder":
      return Promise.resolve(cancelOrder(params));
    default:
      return "";
  }
}

const getOrders = (params: URLSearchParams): string => {
  // Page
  let page = parseInt(params.get('page') || '1');
  let limit = 10;
  let fromIdx = limit * (page - 1);
  let toIdx = limit * page - 1;

  // Sort
  let sort = params.get('sort') || 'updated-descending';

  // Filter
  let filterId = params.get('id') || '';
  let filterStatus = params.get('status') || '';
  let filterCustomerName = params.get('customerName') || '';
  let filterRiderName = params.get('riderName') || '';
  let filterMerchantName = params.get('merchantName') || '';
  let filterUpdatedTime = params.get('updatedTime') || '';

  let orders = data.orders
    .sort((a, b) => {
      let timeA = new Date(a.updatedTime);
      let timeB = new Date(b.updatedTime);

      if (timeA === timeB) return 0;
      if (sort === 'updated-descending') {
        return timeA < timeB ? 1 : -1;
      } else {
        return timeA > timeB ? 1 : -1;
      }
    })
    .filter(x => {
      let matchId = filterId !== '' ? x.id.toString() === filterId : true;
      let matchStatus = filterStatus !== '' ? (x.status.toLowerCase() === filterStatus.toLowerCase()) : true;
      let matchCustomerName = filterCustomerName !== '' ? x.customerName.toLowerCase().includes(filterCustomerName.toLowerCase()) : true;
      let matchRiderName = filterRiderName !== '' ? x.riderName.toLowerCase().includes(filterRiderName.toLowerCase()) : true;
      let matchMerchantName = filterMerchantName !== '' ? x.merchantName.toLowerCase().includes(filterMerchantName.toLowerCase()) : true;

      let matchUpdatedTime = true;
      if (filterUpdatedTime !== '') {
        let orderDate = new Date(x.updatedTime);
        let filterDate = new Date(parseInt(filterUpdatedTime));
        matchUpdatedTime = orderDate > filterDate;
      }

      return matchId && matchStatus && matchCustomerName && matchRiderName && matchMerchantName && matchUpdatedTime;
    })

  let filterData = {
    orders: orders.filter((x, index) => { return index >= fromIdx && index <= toIdx }),
    maxPage: Math.ceil(orders.length / limit)
  }

  return JSON.stringify(filterData);
}

const cancelOrder = (params: URLSearchParams): string => {
  let id = params.get('id') || '';
  if (id !== '') {
    let order = data.orders.find(x => x.id.toString() === id);
    if (order !== undefined) {
      order.status = 'Cancelled';
    }
  }
  return "";
}

export default fetch;