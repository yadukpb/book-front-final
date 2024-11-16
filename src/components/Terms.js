import React from "react";
import { NavLink } from "react-router-dom";

function Terms() {
  return (
    <section className="bookWebPage">
      <h1 className="gradient_head">
        <NavLink to="/about">
          <span style={{ fontSize: "20px" }}>&#8592;</span>&nbsp; Terms and
          Conditions
        </NavLink>
      </h1>
      <ul className="aboutContent">
        <li>
          <span>Introduction: </span>
          Welcome to BookStore, an online marketplace designed for book lovers
          and collectors. Our mission is to make it easy for users to buy and
          sell used books, and to give old books a new life. By using our
          website and services, you agree to be bound by the following terms and
          conditions.
        </li>

        <li>
          <span>User Account:</span> In order to use certain features of our
          website, you must register for an account. You are responsible for
          maintaining the confidentiality of your account and password and for
          restricting access to your computer. You agree to accept
          responsibility for all activities that occur under your account or
          password.
        </li>

        <li>
          <span>Listing and Selling Books:</span> BookStore allows users to list
          and sell used books on our website. By listing a book for sale, you
          agree to accurately describe the condition of the book and to provide
          clear and accurate photos.
        </li>

        <li>
          <span>Buying Books:</span> When you purchase a book on ASAS BookStore, you
          agree to pay the price listed on the website at the time of purchase.
          You also understand that the condition of the book may vary from the
          description provided in the listing.
        </li>

        <li>
          <span>Shipping and Handling:</span> BookStore is not responsible for
          shipping and handling of the books.
        </li>

        <li>
          <span>Returns and Refunds:</span> BookStore is not responsible for
          returns and refunds of the books.
        </li>

        <li>
          <span>Disputes:</span> In the event of a dispute between a buyer and a
          seller, BookStore is not responsible for any disputes and will not be
          held liable for any damages or losses resulting from a dispute.
        </li>

        <li>
          <span>Liability:</span> BookStore will not be liable for any damages or
          losses resulting from the use of our website or services. We make no
          warranty, express or implied, about the completeness, accuracy,
          reliability, suitability or availability with respect to the website
          or the information, products, services, or related graphics contained
          on the website for any purpose.
        </li>

        <li>
          <span>Intellectual Property:</span> The content and designing of our
          website is the property of BookStore or its content suppliers and is
          protected by international copyright laws.
        </li>

        <li>
          <span>Changes to the Terms and Conditions:</span> BookStore reserves
          the right to make changes to these terms and conditions at any time.
          Your continued use of our website and services following any changes
          indicates your acceptance of the new terms and conditions.
        </li>
      </ul>
    </section>
  );
}

export default Terms;
