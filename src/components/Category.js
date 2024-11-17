import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./CSS/category.css";

import categoryLogo from "./images/category.png";
import science from "./images/Categories/science.png";
import programming from "./images/Categories/programming.png";
import math from "./images/Categories/math.png";
import literature from "./images/Categories/literature.png";
import novel from "./images/Categories/novel.png";
import growth from "./images/Categories/growth.png";
import category_select from "./images/Categories/category_select.png";

function Category({ books }) {
  const { catId = 'science' } = useParams();
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const categoryImg = {
    science,
    programming,
    mathematics: math,
    growth,
    novel,
    literature
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchCategoryBooks() {
      if (!catId) {
        setCategoryBooks([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5007/api/books/category/${catId}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            method: 'GET'
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setCategoryBooks(data);
          setRetryCount(0);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Error fetching category books:', err);
        if (isMounted) {
          setError('Failed to load books');
          setCategoryBooks([]);

          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategoryBooks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [catId, retryCount]);

  return (
    <section>
      <div id="categoryHead">
        <div id="categoryList">
          <NavLink to="/category/science" className="books_category">
            <img src={science} alt="Science" />
            <p>Science</p>
          </NavLink>
          <NavLink to="/category/programming" className="books_category">
            <img src={programming} alt="Programming" />
            <p>Programming</p>
          </NavLink>
          <NavLink to="/category/mathematics" className="books_category">
            <img src={math} alt="Mathematics" />
            <p>Mathematics</p>
          </NavLink>
          <NavLink to="/category/growth" className="books_category">
            <img src={growth} alt="Growth" />
            <p>Growth</p>
          </NavLink>
          <NavLink to="/category/novel" className="books_category">
            <img src={novel} alt="Novel" />
            <p>Novel</p>
          </NavLink>
          <NavLink to="/category/literature" className="books_category">
            <img src={literature} alt="Literature" />
            <p>Literature</p>
          </NavLink>
        </div>
        <img src={categoryLogo} alt="recommend logo" width={300} />
      </div>

      <div>
        {catId ? (
          <div id="bookByCategoryHead">
            <img src={categoryImg[catId.toLowerCase()]} alt={catId} />
            <p>{catId[0].toUpperCase() + catId.substring(1)}</p>
          </div>
        ) : (
          <div className="category_select">
            <img src={category_select} alt="category" />
            <p>SELECT <br /> CATEGORY <br /> to BROWSE <br /> BOOKS</p>
          </div>
        )}

        <div id="bookByCategory">
          {isLoading ? (
            <div className="loading">Loading books...</div>
          ) : error ? (
            <div className="error">
              {error}
              {retryCount < 3 && <p>Retrying...</p>}
            </div>
          ) : categoryBooks.length === 0 ? (
            <div className="no-books">No books found in this category</div>
          ) : (
            categoryBooks.map((book) => {
              if (!book || !book.id) return null;
              
              let bName = book.name;
              if (bName?.length > 21) {
                bName = bName.substring(0, 20) + "...";
              }

              return (
                <NavLink
                  to={`/book/${book.id}`}
                  className="bookOverview"
                  key={book.id}
                >
                  <div className="imgContainer">
                    <img 
                      src={book.bookFront} 
                      alt={book.name || 'Book cover'}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'fallback-book-cover.jpg';
                      }}
                    />
                  </div>
                  <h2>{bName || 'Untitled'}</h2>
                  <button>₹{book.price || 'N/A'}</button>
                </NavLink>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Category;
