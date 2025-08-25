const products = [
  { name: "T-Shirt", category: "Clothing" },
  { name: "Jeans", category: "Clothing" },
  { name: "Headphones", category: "Electronics" },
  { name: "Smartphone", category: "Electronics" },
  { name: "Novel", category: "Books" },
  { name: "Cookbook", category: "Books" }
];

const categorySelect = document.getElementById("category");
const productList = document.getElementById("productList");

function displayProducts(filter) {
  productList.innerHTML = ""; 
  const filtered = filter === "All" ? products : products.filter(p => p.category === filter);

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.textContent = p.name;
    productList.appendChild(div);
  });
}

displayProducts("All");

categorySelect.addEventListener("change", (e) => {
  displayProducts(e.target.value);
});
