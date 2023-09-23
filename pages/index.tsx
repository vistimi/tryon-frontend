import React from "react";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cool Title</title>
        <meta name="description" content="Checkout our cool page" key="desc" />
        <meta property="og:title" content="Social Title for Cool Page" />
        <meta
          property="og:description"
          content="And a social description for our cool page"
        />
        {/* <meta property="og:image" content="https://example.com/images/cool-page.jpg" /> */}
      </Head>
    </div>
  );
}


{/* <div class="container">
  <img src="https://www.example.com/image.jpg" alt="Product Image" />
  <h1>Product Name</h1>
  <p>Product description goes here.</p>
  <a href="#" class="btn btn-primary">Add to Cart</a>
</div>
The CSS code for this page would be:

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f2f2f2;
}

.container img {
  max-width: 100%;
  height: auto;
}

.btn {
  margin-right: 10px;
}
The JavaScript code for this page would be:

const productImage = document.querySelector('img');
const productName = document.querySelector('h1');
const productDescription = document.querySelector('p'); */}