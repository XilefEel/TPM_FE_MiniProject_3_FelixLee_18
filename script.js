async function createProduct(productData) {
  return fetch("https://fakestoreapi.com/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  }).then((res) => res.json());
}

async function updateProduct(id, productData) {
  return fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  }).then((res) => res.json());
}

async function deleteProduct(id) {
  return fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}

async function getAllProducts() {
  return fetch("https://fakestoreapi.com/products").then((res) => res.json());
}

const productsGrid = document.querySelector(".products-grid");
const addProductModal = document.querySelector(".add-product-modal");
const editProductModal = document.querySelector(".edit-product-modal");

const pageTitle = document.querySelector(".page-title");

const addButton = document.querySelector(".btn-primary");
const addSubmitButton = document.querySelector(
  ".add-product-modal .btn-primary"
);
const editSubmitButton = document.querySelector(
  ".edit-product-modal .btn-primary"
);

let currentEditingProductId = null;

function showProductsPage() {
  productsGrid.style.display = "grid";
  addButton.style.display = "block";
  pageTitle.textContent = "Products";
  addProductModal.style.display = "none";
  editProductModal.style.display = "none";
}

function showAddPage() {
  productsGrid.style.display = "none";
  addButton.style.display = "none";
  pageTitle.textContent = "Add Product";
  addProductModal.style.display = "flex";
}

function showEditPage(productId) {
  productsGrid.style.display = "none";
  addButton.style.display = "none";
  pageTitle.textContent = "Update Product";
  editProductModal.style.display = "flex";
  currentEditingProductId = productId;
}

function getFormData(modal) {
  const inputs = modal.querySelectorAll(".text-input");
  return {
    title: inputs[0].value.trim(),
    category: inputs[1].value.trim(),
    price: inputs[2].value.trim(),
    description: inputs[3].value.trim(),
  };
}

function validateForm(data) {
  if (!data.title || !data.category || !data.price || !data.description) {
    alert("Please fill in all fields");
    return false;
  }
  if (isNaN(data.price) || parseFloat(data.price) <= 0) {
    alert("Please enter a valid price");
    return false;
  }
  return true;
}

addButton.addEventListener("click", showAddPage);

addSubmitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = getFormData(addProductModal);
  if (!validateForm(data)) return;

  const newProduct = await createProduct({
    title: data.title,
    category: data.category,
    price: parseFloat(data.price),
    description: data.description,
  });

  addProduct(newProduct);
  showProductsPage();
});

editSubmitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = getFormData(editProductModal);
  if (!validateForm(data)) return;

  const updatedProduct = await updateProduct(currentEditingProductId, {
    title: data.title,
    category: data.category,
    price: parseFloat(data.price),
    description: data.description,
  });

  updatedProduct.id = currentEditingProductId;
  updateProduct(updatedProduct);
  showProductsPage();
});

function createProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.dataset.productId = product.id;
  article.innerHTML = `
    <header class="card-header">
      <div class="card-title">
        <img src="${
          product.image || "assets/placeholder.png"
        }" class="card-image" />
        <div>${product.title}</div>
      </div>
    </header>
    <div class="card-body">
      <div class="card-info">
        <div class="info-item"><strong>Category:</strong> ${
          product.category
        }</div>
        <div class="info-item"><strong>Price:</strong> $${product.price}</div>
        <div class="info-item description-row">
          <span class="info-label">Desc:</span>
          <p class="info-text">${product.description}</p>
        </div>
      </div>
      <hr class="divider" />
      <div class="card-actions">
        <button class="icon-btn edit-btn">
          <img src="assets/pencil.svg" class="edit-action" />
        </button>
        <button class="icon-btn delete-btn">
          <img src="assets/trash.svg" class="edit-action" />
        </button>
      </div>
    </div>
  `;

  article.querySelector(".edit-btn").addEventListener("click", () => {
    const inputs = editProductModal.querySelectorAll(".text-input");
    inputs[0].value = product.title;
    inputs[1].value = product.category;
    inputs[2].value = product.price;
    inputs[3].value = product.description;
    showEditPage(product.id);
  });

  article.querySelector(".delete-btn").addEventListener("click", async () => {
    if (confirm("Delete this product?")) {
      await deleteProduct(product.id);
      article.remove();
    }
  });

  return article;
}

function addProduct(product) {
  const card = createProductCard(product);
  productsGrid.appendChild(card);
}

function updateProduct(product) {
  const oldCard = document.querySelector(`[data-product-id="${product.id}"]`);
  const newCard = createProductCard(product);
  oldCard.replaceWith(newCard);
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await getAllProducts();
  products.forEach((product) => addProduct(product));
});
