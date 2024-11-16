import React from "react"
import "./CSS/contactUs.css"

function ContactUs() {
  return (
    <section className="contact-section">
      <h1 className="gradient_head">Contact Us</h1>
      
      <div className="contact-container">
        <div className="last-updated">
          Last updated on 05-11-2024 01:02:47
        </div>
        
        <div className="contact-content">
          <p className="contact-intro">
            You may contact us using the information below:
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <span className="detail-label">Merchant Legal entity name:</span>
              <span className="detail-value">YADUKRISHNA PALAPARAMBIL BABU</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Registered Address:</span>
              <span className="detail-value">Palaparambil House, Ernakulam, Kerala, PIN: 683520</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Operational Address:</span>
              <span className="detail-value">Palaparambil House, Ernakulam, Kerala, PIN: 683520</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Telephone No:</span>
              <span className="detail-value">
                <a href="tel:7907154283">7907154283</a>
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">E-Mail ID:</span>
              <span className="detail-value">
                <a href="mailto:yadukrishnapb1@gmail.com">yadukrishnapb1@gmail.com</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs