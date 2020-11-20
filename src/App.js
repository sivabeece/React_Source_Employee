import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from "lodash";

export default function App() {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [emplist, setEmpList] = useState([]);
  const [empTask, setEmpTask] = useState("Add");
  const [renderInfo, setRenderInfo] = useState({});
  const [isManager, setIsManager] = useState(false);
  const [reporties, setReporties] = useState("");

  const resourceUrl="http://localhost:15301/api/employeemaintenance/";
  
  const ManagerList = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const getDeptList = async () => {
    const results = await Axios.get(`${resourceUrl}user/department/summary`);
    setDepartments(
      (results.data.data || []).map((dept) => ({
        value: dept.id,
        label: dept.text,
      }))
    );
  };
  const getManagers = async () => {
    const results = await Axios.get(`${resourceUrl}user/manager/summary`);
    setManagers(
      (results.data.data || []).map((dept) => ({
        value: dept.id,
        label: dept.text,
      }))
    );
  };

  const getAllEmployees = async () => {
    const results = await Axios.get(`http://localhost:15301/api/employeemaintenance/user/employees/summary`);
    setEmpList(
      (results.data.data || []).map((emp) => ({
        id: emp.id,
        firstname: emp.firstname,
        lastname: emp.lastname,
        doj: emp.doj,
        managername: emp.managername,
        dept: emp.dept,
        address: emp.address,
        manager: emp.manager,
        deptid: emp.deptid,
        managerid:emp.managerid
      }))
    );
  };

  const myreporties = (emp) =>{
      const rep = _.filter(emplist, e => e.managerid === emp.managerid && emp.managerid >0);
      setReporties(
        rep.map(e => e.firstname).join(",")
      );
  }

  const createUpdateEmployee = async () => {
    if(empTask.toLowerCase() === "add"){
      const results = await Axios.post(`${resourceUrl}user/employee/details`, renderInfo);
      if(results.data.data==="success"){
        toast("Employee added successfully");
      } else{
        toast("Something went wrong, try again sometime");
      }
    } else if(empTask.toLowerCase() === "update"){
      const results = await Axios.put(`${resourceUrl}user/${renderInfo.id}/employee/details`, renderInfo);
      if(results.data.data==="success"){
        toast("Employee updated successfully");
      } else{
        toast("Something went wrong, try again sometime");
      }
    }
    getAllEmployees();
  };

  const DeleteEmployee = async (selRow) => {
    const results = await Axios.delete(`${resourceUrl}user/${selRow.id}/employee/delete`, renderInfo);
      if(results.data.data==="success"){
        toast("Employee deleted successfully");
      } else{
        toast("Something went wrong, try again sometime");
      }
      getAllEmployees();
      clearAll();
  };

  useEffect(() => {
    getDeptList();
    getManagers();
    getAllEmployees();
  }, []);

  const handleChange = (e) => {
    if(e.target.id==="manager")  {e.target.value ==="true" ? setIsManager(true) : setIsManager(false)
    }
    setRenderInfo({
      ...renderInfo,
      [e.target.id]: e.target.value,
    });
  };

  const clearAll =()=>{
    setRenderInfo({
      firstname: "",
      lastname: "",
      doj: "",
      manager: false,
      dept: "",
      address: "",
      managername: "",
      deptid: 0,
      managerid:0
    });
  }

  return (
    <div className="App">
      <header className="App-header">Employee Maintenance</header>
      <div className="emp-container table-responsive">
        <table className="table table-bordered" cellPadding="2" cellSpacing="2">
          <thead className="thead-light">
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOJ</th>
            <th>Manager</th>
            <th>Department</th>
            <th></th>
          </thead>
          <tbody>
            {emplist.map((emp) => (
              <tr
                onClick={() => {
                  setRenderInfo(emp);
                  setEmpTask("Update");
                  setIsManager(emp.manager ? setIsManager(true) : setIsManager(false));
                  myreporties(emp);
                }}
              >
                <td>{emp.firstname}</td>
                <td>{emp.lastname}</td>
                <td>{emp.doj}</td>
                <td>{emp.managername}</td>
                <td>{emp.dept}</td>
                <td>
                <button type="button" class="btn btn-outline-danger" onClick={()=>{
DeleteEmployee(emp);
                }}>
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="emp-container">
        <div className="alert alert-info" role="alert">
          <span> {empTask} Employee</span>
        </div>
        <div className="emp-add">{renderLogin()}</div>
      </div>
    </div>
  );

  function renderLogin() {
    return (
      <form className="emp-form">
        <input
          className="form-control"
          id="firstname"
          type="text"
          placeholder="First Name"
          value={renderInfo.firstname}
          onChange={handleChange}
        />
        <input
          className="form-control"
          id="lastname"
          type="text"
          placeholder="Last Name"
          value={renderInfo.lastname}
          onChange={handleChange}
        />
        <textarea
          className="form-control"
          id="address"
          type="text"
          placeholder="Address"
          value={renderInfo.address}
          onChange={handleChange}
        />
        <input
          type="date"
          className="form-control"
          id="doj"
          placeholder="Date of Joining"
          value={
            renderInfo.doj ? renderInfo.doj : ""
          }
          onChange={handleChange}
        />
        <select 
          className="form-control"
          defaultValue="false"
          id="manager"
          value={renderInfo.manager}
          onChange={handleChange}
          
        >
          {ManagerList.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <select
          className="form-control"
          defaultValue="0"
          id="managerid"
          value={renderInfo.managerid}
          onChange={handleChange}
          disabled={isManager}
        >
          <option value="0">Select Manager</option> 
          {managers.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <div style={{display:"flex", justifyContent:"flex-start"}}>
          <span>{reporties}</span>
        </div>
        <select
          className="form-control"
          defaultValue="0"
          id="deptid"
          value={renderInfo.deptid}
          onChange={handleChange}
        >
          <option value="0">Select Department</option> 
          {departments.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
        <div className="form-button">
          <button
            type="button"
            className="btn btn-outline-primary btn-lg"
            onClick={() => {
              
              clearAll();
              setEmpTask("Add");
              setIsManager(true);
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-outline-success btn-lg"
            onClick={() => {
              createUpdateEmployee();
              clearAll();
            }}
          >
            Save
          </button>
          <ToastContainer />
        </div>
      </form>
    );
  }
}
