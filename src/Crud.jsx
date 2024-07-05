


import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import "./Crud.css";

const Crud = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState("");

  // Database reference
  const dbref = collection(db, "StudentForm");

  // Function to add data to Firestore
  const add = async () => {
    try {
      const addData = await addDoc(dbref, {
        Name: name,
        Email: email,
        Phone: phone
      });
      if (addData) {
        alert("Data saved successfully");
        fetch(); // Fetch updated data after adding
        clearForm(); // Clear form fields after adding
      } else {
        alert("Error: Something went wrong");
      }
    } catch (error) {
      alert("Error: Something went wrong");
    }
  };

  // Function to fetch data from Firestore
  const fetch = async () => {
    try {
      const snapshot = await getDocs(dbref);
      const fetchData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFetchData(fetchData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetch();
  }, []);

  // Function to populate form fields with selected data
  const passData = (id) => {
    const matchId = fetchData.find((data) => data.id === id);
    if (matchId) {
      setName(matchId.Name);
      setEmail(matchId.Email);
      setPhone(matchId.Phone);
      setId(matchId.id);
    }
  };

  // Function to update data in Firestore
  const update = async () => {
    try {
      const updateref = doc(db, "StudentForm", id);
      await updateDoc(updateref, {
        Name: name,
        Email: email,
        Phone: phone
      });
      alert("Data updated successfully");
      fetch(); // Fetch updated data after updating
      clearForm(); // Clear form fields after updating
    } catch (error) {
      alert("Error updating data: ", error);
    }
  };

  // Function to delete data from Firestore
  const del = async (id) => {
    try {
      const delref = doc(db, "StudentForm", id);
      await deleteDoc(delref);
      alert("Data deleted successfully");
      fetch(); // Fetch updated data after deleting
    } catch (error) {
      alert("Error deleting data: ", error);
    }
  };

  // Function to clear form fields
  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setId("");
  };

  return (
    <>
      <div className="form_Container">
        <h2>Student Form</h2>
        <div className="box">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="box">
          <input
            type="text"
            placeholder="Number"
            value={phone}
            autoComplete="off"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button onClick={add}>Add</button>
        <button onClick={update}>Update</button>
      </div>
      <div className="database">
        <h2>CRUD database</h2>
        <div className="container">
          <div className= "title">
          <h3>Names</h3>
          <h3>Emails</h3>
          <h3>Phone NO.</h3>
          <h3>Modifiy Data</h3>
          </div>
          {fetchData.map((data) => (
            <div className="box" key={data.id}>
              <h3>{data.Name}</h3>
              <h3>{data.Email}</h3>
              <h3>{data.Phone}</h3>
              <button onClick={() => passData(data.id)}>Update</button>
              <button onClick={() => del(data.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Crud;
