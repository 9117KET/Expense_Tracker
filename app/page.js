'use client';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  /*
   * State Variables:
   * - items: Stores all expense items. Updated in real-time with database changes.
   * - newItem: Temporarily holds data for a new expense being added.
   * - total: Represents the sum of all expenses. Recalculated when items change.
   * - error: Stores error messages for displaying to the user.
   * 
   * These states are crucial for managing the app's data and driving UI updates.
   */
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({name: '', price: ''});
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  /*
   * Add Item Function:
   * - Triggered on form submission.
   * - Validates input (non-empty name and price).
   * - Adds new item to Firestore with a timestamp.
   * - Resets the newItem state after successful addition.
   * - Sets error state if addition fails or validation fails.
   * 
   * This function allows users to add new expenses, updating both the
   * database and, indirectly through the listener, the UI.
   */
  const addItem = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (newItem.name.trim() === '') {
      setError('Please enter an expense name.');
      return;
    }
    if (newItem.price === '') {
      setError('Please enter an amount.');
      return;
    }

    try {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        createdAt: new Date(),
      });
      setNewItem({ name: '', price: '' });
    } catch (error) {
      console.error('Error adding item: ', error);
      setError('Failed to add item. Please try again.');
    }
  };

  /*
   * Read Items from Database:
   * - Runs once on component mount.
   * - Sets up a real-time listener to Firestore.
   * - Sorts items by creation time (newest first).
   * - Updates 'items' state whenever the database changes.
   * - Converts item prices to numbers for consistency.
   * - Provides error feedback if fetching fails.
   * - Cleans up listener on component unmount.
   * 
   * This ensures the app always displays current data and reacts to
   * real-time changes, maintaining synchronization with the database.
   */
  useEffect(() => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        price: Number(doc.data().price),
      }));
      setItems(itemsArr);
    }, (error) => {
      console.error('Error fetching items: ', error);
      alert('Failed to fetch items. Please refresh the page.');
    });

    return () => unsubscribe();
  }, []);

  /*
   * Calculate Total:
   * - Runs whenever the 'items' state changes.
   * - Sums up all item prices.
   * - Updates the 'total' state with the new sum.
   * 
   * This keeps the total expense amount current and accurately displayed,
   * reflecting any additions or deletions of items.
   */
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal.toFixed(2));
  }, [items]);

  /*
   * Delete Item Function:
   * - Triggered when user clicks to delete an item.
   * - Confirms the action with the user.
   * - Deletes the item from Firestore if confirmed.
   * - Sets error state if deletion fails.
   * 
   * This allows users to remove expenses, updating both the database
   * and, through the listener, the UI. It helps maintain data accuracy.
   */
  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setError(null); // Clear any previous errors
      try {
        await deleteDoc(doc(db, 'items', id));
        console.log('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item: ', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className='text-4xl text-center'>Expense Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          {/* Display error message if there is an error */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          {/* Form for adding new expenses */}
          <form className="grid grid-cols-6 items-center text-black" onSubmit={addItem}>
            <input 
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="col-span-3 p-3 border" 
              type="text" 
              placeholder="Enter your expenses" 
            />
            <input 
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              className="col-span-2 p-3 border mx-3"
              type="number" 
              placeholder="Enter the amount" 
              step="0.01"
              min="0"
            />
            <button 
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
              type="submit"
            >
              +
            </button>
          </form>
          {/* List of expense items */}
          <ul>
            {items.map((item) => (
              <li key={item.id} className='my-4 w-full flex justify-between bg-slate-950 rounded'>
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.name}</span>
                  <span>${parseFloat(item.price).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className='text-red-50 ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {/* Display total if there are items */}
          {items.length > 0 && (
            <div className='flex justify-between p-3'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}