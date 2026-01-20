// src/components/AddUser.js
import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

const AddUser = () => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return alert("Enter a name");
    try {
      await addDoc(collection(firestore, "users"), { name });
      alert("User added!");
      setName("");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add user");
    }
  };

  return (
    <div className="p-4">
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        className="border p-2"
      />
      <button onClick={handleAdd} className="ml-2 bg-blue-500 text-white px-4 py-2">
        Add User
      </button>
    </div>
  );
};

export default AddUser;
