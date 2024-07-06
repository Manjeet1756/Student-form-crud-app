import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import "./Crud.css";

const Crud = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (search === "") {
        setResults([]);
        return;
      }

      const q = query(
        collection(db, "StudentForm"),
        where("name", ">=", search),
        where("name", "<=", search + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(data);
    };

    fetchData();
  }, [search]);

  // Database reference
  const dbref = collection(db, "StudentForm");

  // Function to add data to Firestore
  const add = async () => {
    try {
      const addData = await addDoc(dbref, {
        name: name,
        email: email,
        phone: phone,
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
        ...doc.data(),
      }));
      // Sort data by name
      fetchData.sort((a, b) => a.name.localeCompare(b.name));
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
      setName(matchId.name);
      setEmail(matchId.email);
      setPhone(matchId.phone);
      setId(matchId.id);
    }
  };

  // Function to update data in Firestore
  const update = async () => {
    try {
      const updateref = doc(db, "StudentForm", id);
      await updateDoc(updateref, {
        name: name,
        email: email,
        phone: phone,
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
      <div
        style={{
          height: "200px",
          width: "100%",
          padding: "50px",
          boxSizing: "border-box",
        }}
      >
        <input
          style={{ fontSize: "20px", outline: "2px solid black" }}
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleChange}
        />
        <ul style={{ listStyle: "none" }}>
          {results.map((result) => (
            <li key={result.id}>
              {result.name} , {result.email} , {result.phone}
            </li>
          ))}
        </ul>
      </div>
      <div className="database">
        <h2>CRUD database</h2>
        <div className="container">
          <div className="title">
            <h3>Names</h3>
            <h3>Emails</h3>
            <h3>Phone NO.</h3>
            <h3>Modify Data</h3>
          </div>
          {fetchData.map((data) => (
            <div className="box" key={data.id}>
              <h3>{data.name}</h3>
              <h3>{data.email}</h3>
              <h3>{data.phone}</h3>
              <button className="update" onClick={() => passData(data.id)}>
                Update
              </button>
              <button className="delete" onClick={() => del(data.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Crud;
