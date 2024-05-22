document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      const productsContainer = document.getElementById('products-container');
  
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
  
        productDiv.innerHTML = `
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>Precio: $${product.price}</p>
        `;
  
        productsContainer.appendChild(productDiv);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  });
  