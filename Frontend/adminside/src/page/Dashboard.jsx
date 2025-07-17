import React from "react";
function Dashboard() {
  return (
    <div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Upcoming Orders</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </th>
                      <th> Client Name </th>
                      <th> Order No </th>
                      <th> Product Cost </th>
                      <th> Project </th>
                      <th> Payment Mode </th>
                      <th> Start Date </th>
                      <th colSpan={2}> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img src="assets/images/faces/face1.jpg" alt="image" />
                        <span className="pl-2">Henry Klein</span>
                      </td>
                      <td> 02312 </td>
                      <td> $14,500 </td>
                      <td> Dashboard </td>
                      <td> Credit card </td>
                      <td> 04 Dec 2019 </td>
                      <td>
                        <button className="btn btn-success"> Approve</button>
                      </td>
                      <td>
                        <button className="btn btn-danger"> Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img src="assets/images/faces/face2.jpg" alt="image" />
                        <span className="pl-2">Estella Bryan</span>
                      </td>
                      <td> 02312 </td>
                      <td> $14,500 </td>
                      <td> Website </td>
                      <td> Cash on delivered </td>
                      <td> 04 Dec 2019 </td>
                      <td>
                        <button className="btn btn-success"> Approve</button>
                      </td>
                      <td>
                        <button className="btn btn-danger"> Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img src="assets/images/faces/face5.jpg" alt="image" />
                        <span className="pl-2">Lucy Abbott</span>
                      </td>
                      <td> 02312 </td>
                      <td> $14,500 </td>
                      <td> App design </td>
                      <td> Credit card </td>
                      <td> 04 Dec 2019 </td>
                      <td>
                        <button className="btn btn-success"> Approve</button>
                      </td>
                      <td>
                        <button className="btn btn-danger"> Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img src="assets/images/faces/face3.jpg" alt="image" />
                        <span className="pl-2">Peter Gill</span>
                      </td>
                      <td> 02312 </td>
                      <td> $14,500 </td>
                      <td> Development </td>
                      <td> Online Payment </td>
                      <td> 04 Dec 2019 </td>
                      <td>
                        <button className="btn btn-success"> Approve</button>
                      </td>
                      <td>
                        <button className="btn btn-danger"> Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="form-check form-check-muted m-0">
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <img src="assets/images/faces/face4.jpg" alt="image" />
                        <span className="pl-2">Sallie Reyes</span>
                      </td>
                      <td> 02312 </td>
                      <td> $14,500 </td>
                      <td> Website </td>
                      <td> Credit card </td>
                      <td> 04 Dec 2019 </td>
                      <td>
                        <button className="btn btn-success"> Approve</button>
                      </td>
                      <td>
                        <button className="btn btn-danger"> Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
