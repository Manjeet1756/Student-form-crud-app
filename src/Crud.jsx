import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {doc,
  collection,
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
  const [fetchData, setfetchData] = useState([]);
  const [id , setId] = useState("");
  //database reference
  const dbref = collection(db, "StudenForm");
  //storing data into database

  const add = async () => {
    const addData = await addDoc(dbref, {
      Name: name,
      Email: email,
      Phone: phone,
    });
    if (addData) {
      alert("data saved sucessfully");
      window.location.reload();
    } else {
      alert("error:kuch to loch h babu bhaiya");
    }
  };

  const fetch = async () => {
    const snapshot = await getDocs(dbref);
    const fetchdata = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setfetchData(fetchdata);
    
  };
  useEffect(() => {
    fetch();
  }, []);

const passData = async (id)=>{

    const matchId =  fetchData.find((data)=>{

         return data.id === id;

    }
)
   setName(matchId.Name);
    setEmail(matchId.Email);
    setPhone(matchId.Phone);
    setId(matchId.id);

}

const update = async () => {
  const updateref = doc(db, "StudentForm", id);

  try {
    await updateDoc(updateref, {
      Name: name,
      Email: email,
      Phone: phone
    });
    alert("Update successful");
    window.location.reload();
  } catch (error) {
    alert("Error occurred during update");
  }
};

const del= async (id)=>{
  const delref = doc(dbref,id);
  try{
await deleteDoc(delref);
alert("deleted successfully");
wind0w.location.reload();

  }

  catch(error){

    alert("error occured")


  }

}

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
        <h2>cRuD database</h2>
        <div className="container">
          {fetchData.map((data) => {
            return (
              <>
                <div className="box">
                  <h3>Name:{data.Name}</h3>
                  <h3>Email:{data.Email}</h3>
                  <h3>Phone:{data.Phone}</h3>
                  <button onClick={()=>passData(data.id)}>update</button>
                  <button onClick={()=>del(data.id)}>delete</button>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Crud;
