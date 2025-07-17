import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const OrderHistory = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Order History</h2>

      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ORD12345</td>
              <td>2025-04-10</td>
              <td>$120.00</td>
              <td><span className="badge badge-success">Delivered</span></td>
              <td className='text-success'>Paid</td>
            </tr>

            <tr>
              <td>ORD12346</td>
              <td>2025-04-12</td>
              <td>$80.00</td>
              <td><span className="badge badge-success">Delivered</span></td>
              <td className='text-success'>Paid</td>
            </tr>

            <tr>
              <td>ORD12347</td>
              <td>2025-04-14</td>
              <td>$200.00</td>
              <td><span className="badge badge-warning">Pending</span></td>
              <td className='text-warning'>Pending</td>
            </tr>
            <tr>
              <td>ORD12347</td>
              <td>2025-04-14</td>
              <td>$200.00</td>
              <td><span className="badge badge-danger">Rejected</span></td>
              <td className='text-danger'>Failed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
