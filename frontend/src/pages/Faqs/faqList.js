/* eslint-disable max-len */
import React from 'react'
import { Link } from 'react-router-dom'

import IconUser from 'icons/IconUser'

export default [
  {
    "question": "How do I join Yuma?",
    "answer": <div>
      Registering is easy. To begin, just click the <IconUser className="text-primary" /> icon on the upper right hand corner of your screen. Add your contact info and create a username and password, or connect to Yuma through your Facebook account. This username will be publicly displayed any time you place a bid. Next, add payment and billing information to your account. (Don't worry, you won't be charged unless you win an auction!) Lastly, provide us with your shipping address. When you're finished, you can place bids, track auction lots, and modify your account settings.
    </div>,
  },
  {
    "question": "Why do you need my credit card information if I haven't won anything yet?",
    "answer": "Your credit card will only be charged if you're an auction winner. When you win an auction, we'll process your credit card right away for the winning bid amount, shipping and handling, and sales tax, if applicable.",
  },
  {
    "question": "Does it cost anything to join?",
    "answer": "There is no cost to become a Yuma bidder. Your credit card will only be charged if you win an auction lot.",
  },
  {
    "question": "Why do I have a $1 pending charge from Yuma on my statement or account?",
    "answer": "This is for credit card validation purposes. The $1 was an authorization and should fall off your account within 72 hours. This $1 authorization does not imply that a purchase from Yuma has been made or attempted, and there are no further pending charges as a result of our validation.",
  },
  {
    "question": "Is my personal and credit card information safe on your site?",
    "answer": "Safeguarding your personal information is of the utmost importance to us. We adhere to the PCI Data Security Standard (PCI DSS) which is a set of requirements around data security that covers areas like security policies and their enforcement, system and network architecture, software design, and monitoring and testing. All transactions are conducted via a Secure Sockets Layer (SSL) encrypted channel. Your credit card information and other personally identifiable information (PII) is never sent in plain unencrypted text. Transaction information is stored in a secure and encrypted manner. Our employees have access to your name and contact information, but not to your credit card information.",
  },
  {
    "question": "How do I arrange the celebrity experience I won?",
    "answer": <div>
      Someone from the Yuma Customer Care team will contact you to coordinate your celebrity experience on a mutually agreeable date. You are welcome to <Link to="/support">
        contact
      </Link> this Customer Care at any time with questions or concerns.
    </div>
  },
  {
    "question": "When will I receive my item?",
    "answer": "We want to make sure your item arrives safely and quickly. Hard copies of tickets, travel certificates, and merchandise are shipped via FedEx as quickly as possible after a credit card has been charged. We use professional shipping services for delivery of high-value, tangible items and will work closely with you to arrange a convenient delivery date. We insure tangible items for the full value of the winning bid."
  }
]
