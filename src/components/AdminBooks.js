import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBook, setNewBook] = useState({
    name: '', description: '', category: '', price: '', mrp: '', edition: '',
    publisher: '', seller: '', sellerId: '', location: '', pincode: '',
    telegram: '', bookFront: '', bookBack: '', bookMiddle: '', bookIndex: ''
  });
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('adminBooks') || '[]');
    setBooks(storedBooks);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewBookChange = (event) => {
    const { name, value } = event.target;
    setNewBook(prevBook => ({ ...prevBook, [name]: value }));
  };

  const handleAddBook = async () => {
    try {
      const docRef = await addDoc(collection(db, "books"), newBook);
      setBooks(prevBooks => [...prevBooks, { ...newBook, id: docRef.id }]);
      setNewBook({
        name: '', description: '', category: '', price: '', mrp: '', edition: '',
        publisher: '', seller: '', sellerId: '', location: '', pincode: '',
        telegram: '', bookFront: '', bookBack: '', bookMiddle: '', bookIndex: ''
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingBook(prevBook => ({ ...prevBook, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "books", editingBook.id), editingBook);
      setBooks(prevBooks => prevBooks.map(book => 
        book.id === editingBook.id ? editingBook : book
      ));
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <h1>Admin Books</h1>
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <h2>Add New Book</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddBook(); }}>
        <input name="name" value={newBook.name} onChange={handleNewBookChange} placeholder="Book Name" required />
        <textarea name="description" value={newBook.description} onChange={handleNewBookChange} placeholder="Description" required />
        <input name="category" value={newBook.category} onChange={handleNewBookChange} placeholder="Category" required />
        <input name="price" type="number" value={newBook.price} onChange={handleNewBookChange} placeholder="Price" required />
        <input name="mrp" type="number" value={newBook.mrp} onChange={handleNewBookChange} placeholder="MRP" required />
        <input name="edition" value={newBook.edition} onChange={handleNewBookChange} placeholder="Edition" required />
        <input name="publisher" value={newBook.publisher} onChange={handleNewBookChange} placeholder="Publisher" required />
        <input name="seller" value={newBook.seller} onChange={handleNewBookChange} placeholder="Seller" required />
        <input name="sellerId" value={newBook.sellerId} onChange={handleNewBookChange} placeholder="Seller ID" required />
        <input name="location" value={newBook.location} onChange={handleNewBookChange} placeholder="Location" required />
        <input name="pincode" value={newBook.pincode} onChange={handleNewBookChange} placeholder="Pincode" required />
        <input name="telegram" value={newBook.telegram} onChange={handleNewBookChange} placeholder="Telegram" required />
        <input name="bookFront" value={newBook.bookFront} onChange={handleNewBookChange} placeholder="Book Front URL" required />
        <input name="bookBack" value={newBook.bookBack} onChange={handleNewBookChange} placeholder="Book Back URL" required />
        <input name="bookMiddle" value={newBook.bookMiddle} onChange={handleNewBookChange} placeholder="Book Middle URL" required />
        <input name="bookIndex" value={newBook.bookIndex} onChange={handleNewBookChange} placeholder="Book Index URL" required />
        <button type="submit">Add Book</button>
      </form>
      <h2>Book List</h2>
      {filteredBooks.map(book => (
        <div key={book.id}>
          {editingBook && editingBook.id === book.id ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <input name="name" value={editingBook.name} onChange={handleEditChange} required />
              <textarea name="description" value={editingBook.description} onChange={handleEditChange} required />
              <input name="category" value={editingBook.category} onChange={handleEditChange} required />
              <input name="price" type="number" value={editingBook.price} onChange={handleEditChange} required />
              <input name="mrp" type="number" value={editingBook.mrp} onChange={handleEditChange} required />
              <input name="edition" value={editingBook.edition} onChange={handleEditChange} required />
              <input name="publisher" value={editingBook.publisher} onChange={handleEditChange} required />
              <input name="seller" value={editingBook.seller} onChange={handleEditChange} required />
              <input name="sellerId" value={editingBook.sellerId} onChange={handleEditChange} required />
              <input name="location" value={editingBook.location} onChange={handleEditChange} required />
              <input name="pincode" value={editingBook.pincode} onChange={handleEditChange} required />
              <input name="telegram" value={editingBook.telegram} onChange={handleEditChange} required />
              <input name="bookFront" value={editingBook.bookFront} onChange={handleEditChange} required />
              <input name="bookBack" value={editingBook.bookBack} onChange={handleEditChange} required />
              <input name="bookMiddle" value={editingBook.bookMiddle} onChange={handleEditChange} required />
              <input name="bookIndex" value={editingBook.bookIndex} onChange={handleEditChange} required />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingBook(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <h3>{book.name}</h3>
              <p>Author: {book.seller}</p>
              <p>Category: {book.category}</p>
              <p>Price: {book.price}</p>
              <button onClick={() => handleEdit(book)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminBooks;
