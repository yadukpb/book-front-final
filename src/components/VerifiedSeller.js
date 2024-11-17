import React, { useState, useEffect } from "react";
import "./CSS/verifiedSeller.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import addImage from "./images/Seller/addImage.png";
import category from "./images/Seller/category.png";
import description from "./images/Seller/description.png";
import Edition from "./images/Seller/Edition.png";
import rupee from "./images/Seller/rupee.png";
import title from "./images/Seller/Title.png";
import publication from "./images/Seller/publication.png";
import menuVertical from "./images/Seller/menuVertical.png";
import preview from "./images/Seller/preview.png";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const handleImageChange = (e, setImage) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    setImage(file);
  }
};

function VerifiedSeller({ verified, userId, user, bookId }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookName, setbookName] = useState("");
  const [bookDesc, setbookDesc] = useState("");
  const [bookFront, setbookFront] = useState("");
  const [bookBack, setbookBack] = useState("");
  const [bookIndex, setbookIndex] = useState("");
  const [bookMiddle, setbookMiddle] = useState("");
  const [bookPrice, setbookPrice] = useState("");
  const [bookMRP, setbookMRP] = useState("");
  const [bookEdition, setbookEdition] = useState("");
  const [bookPublisher, setbookPublisher] = useState("");
  const [bookCategory, setbookCategory] = useState("science");
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to sell your book');
      window.location.href = '/auth'; // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true);
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!verified) {
      window.location.href = '/seller';
    }
  }, [verified]);

  useEffect(() => {
    const fetchPurchaseInfo = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`http://localhost:5007/api/purchases/${bookId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setPurchaseInfo(data);
        }
    };

    fetchPurchaseInfo();
  }, [bookId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to sell your book');
      return;
    }
  
    if (!bookFront || !bookIndex || !bookMiddle || !bookBack) {
      toast.error('Please upload all four book images');
      return;
    }
  
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('bookFront', bookFront);
      formData.append('bookBack', bookBack);
      formData.append('bookIndex', bookIndex);
      formData.append('bookMiddle', bookMiddle);
  
      const uploadResponse = await fetch('http://localhost:5007/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }
  
      const uploadData = await uploadResponse.json();
  
      const bookData = {
        name: bookName,
        description: bookDesc,
        price: parseFloat(bookPrice),
        mrp: parseFloat(bookMRP),
        edition: parseInt(bookEdition),
        publisher: bookPublisher,
        category: bookCategory,
        bookFront: uploadData.urls.bookFront,
        bookBack: uploadData.urls.bookBack,
        bookIndex: uploadData.urls.bookIndex,
        bookMiddle: uploadData.urls.bookMiddle
      };
  
      const bookResponse = await fetch('http://localhost:5007/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });
  
      if (!bookResponse.ok) {
        const errorData = await bookResponse.json();
        throw new Error(errorData.message || 'Failed to create book');
      }
  
      toast.success('Book uploaded successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.message || 'Failed to upload book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1 className="gradient_head" id="vSellerHead">
        Sell Books
      </h1>
      <div id="vSellerUploadBook">
        <div id="vSellerBookPhotos">
          <p>Upload 4 photos of the book</p>
          <div className="vSellerBookPhotosMain">
            <label className="UploadBookImage">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setbookFront)}
              />
              <img
                src={bookFront ? URL.createObjectURL(bookFront) : addImage}
                alt="add"
              />
              <p>Front</p>
            </label>
            <label className="UploadBookImage">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setbookIndex)}
              />
              <img
                src={bookIndex ? URL.createObjectURL(bookIndex) : addImage}
                alt="add"
              />
              <p>Index</p>
            </label>
          </div>
          <div className="vSellerBookPhotosMain">
            <label className="UploadBookImage">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setbookMiddle)}
              />
              <img
                src={bookMiddle ? URL.createObjectURL(bookMiddle) : addImage}
                alt="add"
              />
              <p>Middle</p>
            </label>
            <label className="UploadBookImage">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setbookBack)}
              />
              <img
                src={bookBack ? URL.createObjectURL(bookBack) : addImage}
                alt="add"
              />
              <p>Back</p>
            </label>
          </div>
        </div>
        <div id="vSellerDivider"></div>
        <div id="vSellerBookDetails">
          <div id="bookDetailsHead">
            <h2>Book Details</h2>
            <img
              src={menuVertical}
              alt="menu"
              onClick={() => {
                const popup = document.getElementById("bookDetailHeadMenu");
                popup.style.display =
                  popup.style.display === "flex" ? "none" : "flex";
                if (popup.style.display === "flex") {
                  setTimeout(() => {
                    function optionPop(e) {
                      if (!popup.contains(e.target)) {
                        popup.style.display = "none";
                        document.removeEventListener("click", optionPop);
                      }
                    }
                    document.addEventListener("click", optionPop);
                  }, 10);
                }
              }}
            />
          </div>
          <div id="bookDetailHeadMenu">
            <h3>Options</h3>
            <div>
              <img src={preview} alt="Preview" />
              <p>Overview</p>
            </div>
            <div>
              <img src={description} alt="Example" />
              <p>Example</p>
            </div>
          </div>
          <form onSubmit={handleUpload}>
            <div className="bookInputBox">
              <img src={title} alt="title" />
              <input
                value={bookName}
                onChange={(e) => setbookName(e.target.value)}
                maxLength={30}
                type="text"
                placeholder="Enter book title or name"
                style={{ width: "81%" }}
                required
              />
              <span title="Character Limit">{30 - bookName.length}</span>
            </div>
            <div className="bookInputRow">
              <div className="bookInputBox">
                <img src={rupee} alt="rupee" />
                <input
                  type="number"
                  value={bookPrice}
                  onChange={(e) => setbookPrice(e.target.value)}
                  placeholder="Enter book price"
                  required
                  min={0}
                  max={10000}
                />
              </div>
              <div className="bookInputBox">
                <img src={rupee} alt="rupee" />
                <input
                  type="number"
                  value={bookMRP}
                  onChange={(e) => setbookMRP(e.target.value)}
                  placeholder="Book market price(MRP)"
                  required
                  min={0}
                  max={10000}
                />
              </div>
            </div>
            <div className="bookInputBox">
              <img src={description} alt="description" />
              <input
                value={bookDesc}
                onChange={(e) => setbookDesc(e.target.value)}
                maxLength={280}
                type="text"
                placeholder="Enter description about book & its condition"
                style={{ width: "80%" }}
                required
              />
              <span title="Character Limit">{280 - bookDesc.length}</span>
            </div>
            <div className="bookInputRow">
              <div className="bookInputBox">
                <img src={Edition} alt="edition" />
                <input
                  type="number"
                  value={bookEdition}
                  onChange={(e) => setbookEdition(e.target.value)}
                  placeholder="Edition(Year)"
                  required
                  min={1990}
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="bookInputBox">
                <img src={publication} alt="publisher" />
                <input
                  type="text"
                  value={bookPublisher}
                  onChange={(e) => setbookPublisher(e.target.value)}
                  placeholder="Publisher "
                  required
                  maxLength={25}
                />
              </div>
            </div>
            <div id="bookInputCategory">
              <img src={category} alt="category" />
              <label htmlFor="bookInputCategorySelect">Select Category</label>
              <select
                id="bookInputCategorySelect"
                value={bookCategory}
                onChange={(e) => setbookCategory(e.target.value)}
              >
                <option value="science">Science</option>
                <option value="programming">Programming</option>
                <option value="growth">Growth</option>
                <option value="mathematics">Mathematics</option>
                <option value="novel">Novel</option>
                <option value="literature">Literature</option>
              </select>
            </div>
            <div className="detailButtons">
              <button 
                type="submit" 
                disabled={!isAuthenticated || isLoading}
              >
                {isLoading ? 'Uploading...' : 'Sell Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
      {purchaseInfo && (
        <div className="purchase-receipt">
            <h3>Purchase Receipt</h3>
            <p>Book: {purchaseInfo.bookId.name}</p>
            <p>Price: {purchaseInfo.amount}</p>
            <p>Payment Method: {purchaseInfo.paymentId}</p>
            <p>Status: {purchaseInfo.status}</p>
            <p>Date: {new Date(purchaseInfo.timestamp).toLocaleDateString()}</p>
        </div>
      )}
    </section>
  );
}

export default VerifiedSeller;