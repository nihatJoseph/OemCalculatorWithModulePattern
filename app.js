// STORAGE CONTROLLER MODULE

const StorageController = (() => {
  return {
    storeProduct: (product) => {
      let products;

      if (localStorage.getItem("products") === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem("products"));
        products.push(product);
      }
      localStorage.setItem("products", JSON.stringify(products));
    },
    getProducts: () => {
      let products;
      if (localStorage.getItem("products") === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem("products"));
      }
      return products;
    },
    updateProduct: (product) => {
      let products = JSON.parse(localStorage.getItem("products"));

      products.forEach((prd, index) => {
        if (product.id == prd.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },
    deleteProduct: (id) => {
      let products = JSON.parse(localStorage.getItem("products"));

      products.forEach((prd, index) => {
        if (id == prd.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem("products", JSON.stringify(products));
    },
  };
})();





// PRODUCT CONTROLLER MODULE

const ProductController = (() => {
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };

  return {
    getProducts: () => {
      return data.products;
    },
    getData: () => {
      console.log(data);
      return data;
    },
    getProductById: (id) => {
      let product = null;

      data.products.forEach((prd) => {
        if (prd.id == id) {
          product = prd;
        }
      });

      return product;
    },
    setCurrentProduct: (product) => {
      data.selectedProduct = product;
    },
    getCurrentProduct: () => {
      return data.selectedProduct;
    },
    addProduct: (name, price) => {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    updateProduct: (name, price) => {
      let product = null;

      data.products.forEach((prd) => {
        if (prd.id == data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });

      return product;
    },
    deleteProduct: (product) => {
      data.products.forEach((prd, index) => {
        if (prd.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },
    getTotal: () => {
      let total = 0;

      data.products.forEach((item) => {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();





// UI MODULE

const UIController = (() => {
  const Selectors = {
    productList: "#item-list",
    productListItems: "#item-list tr",
    addButton: ".addBtn",
    updateButton: ".updateBtn",
    cancelButton: ".cancelBtn",
    deleteButton: ".deleteBtn",
    productName: "#productName",
    productPrice: "#productPrice",
    productCard: "#productCard",
    totalTl: "#total-tl",
    totalDollar: "#total-dollar",
  };

  return {
    createProductList: (products) => {
      let html = "";

      products.forEach((prd) => {
        html += `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name} </td>
                    <td>${prd.price} $</td>
                    <td class="text-end">
                      <i class="fas fa-edit edit-product"></i>
                    </td>
                </tr>
                `;
      });
      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: () => {
      return Selectors;
    },
    addProduct: (prd) => {
      document.querySelector(Selectors.productCard).style.display = "block";
      let item = `
      <tr>
        <td>${prd.id}</td>
        <td>${prd.name} </td>
        <td>${prd.price} $</td>
        <td class="text-end">
          <i class="fas fa-edit edit-product"></i>
        </td>
      </tr>
      `;
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    updateProduct: (prd) => {
      let updatedItem = null;

      let items = document.querySelectorAll(Selectors.productListItems);

      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + " $";
          updatedItem = item;
        }
      });

      return updatedItem;
    },
    clearInputs: () => {
      document.querySelector(Selectors.productName).value = "";
      document.querySelector(Selectors.productPrice).value = "";
    },
    clearWarnings: () => {
      const items = document.querySelectorAll(Selectors.productListItems);

      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },
    hideCard: () => {
      document.querySelector(Selectors.productCard).style.display = "none";
    },
    showTotal: (total) => {
      document.querySelector(Selectors.totalDollar).textContent = total;
      document.querySelector(Selectors.totalTl).textContent = total * 15;
    },
    addProductToForm: () => {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value =
        selectedProduct.name;
      document.querySelector(Selectors.productPrice).value =
        selectedProduct.price;
    },
    deleteProduct: () => {
      let items = document.querySelectorAll(Selectors.productListItems);

      items.forEach((item) => {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },
    addingState: (item) => {
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = "inline";
      document.querySelector(Selectors.updateButton).style.display = "none";
      document.querySelector(Selectors.cancelButton).style.display = "none";
      document.querySelector(Selectors.deleteButton).style.display = "none";
    },
    editState: (tr) => {
      tr.classList.add("bg-warning");
      document.querySelector(Selectors.addButton).style.display = "none";
      document.querySelector(Selectors.updateButton).style.display = "inline";
      document.querySelector(Selectors.cancelButton).style.display = "inline";
      document.querySelector(Selectors.deleteButton).style.display = "inline";
    },
  };
})();






// APP MODULE

const App = ((ProductCtrl, UICtrl, StorageCtrl) => {
  const UISelectors = UIController.getSelectors();

  const loadEventListeners = () => {
    document
      .querySelector(UISelectors.addButton)
      .addEventListener("click", productAddSubmit);

    document
      .querySelector(UISelectors.productList)
      .addEventListener("click", productEditClick);

    document
      .querySelector(UISelectors.updateButton)
      .addEventListener("click", editProductSubmit);

    document
      .querySelector(UISelectors.cancelButton)
      .addEventListener("click", cancelUpdate);

    document
      .querySelector(UISelectors.deleteButton)
      .addEventListener("click", deleteProductSubmit);
  };

  const productAddSubmit = (e) => {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      const newProduct = ProductCtrl.addProduct(productName, productPrice);

      UIController.addProduct(newProduct);

      StorageCtrl.storeProduct(newProduct);

      const total = ProductCtrl.getTotal();

      UICtrl.showTotal(total);

      UIController.clearInputs();
    }

    e.preventDefault();
  };

  const productEditClick = (e) => {
    if (e.target.classList.contains("edit-product")) {
      const id =
        e.target.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      const product = ProductCtrl.getProductById(id);

      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      UICtrl.addProductToForm();

      UICtrl.editState(e.target.parentElement.parentElement);
    }

    e.preventDefault();
  };

  const editProductSubmit = (e) => {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      const updatedProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );

      let item = UICtrl.updateProduct(updatedProduct);

      const total = ProductCtrl.getTotal();

      UICtrl.showTotal(total);

      StorageCtrl.updateProduct(updatedProduct);

      UICtrl.addingState();
    }

    e.preventDefault();
  };

  const cancelUpdate = (e) => {
    UICtrl.addingState();
    UICtrl.clearWarnings();

    e.preventDefault();
  };

  const deleteProductSubmit = (e) => {
    const selectedProduct = ProductCtrl.getCurrentProduct();

    ProductCtrl.deleteProduct(selectedProduct);

    UICtrl.deleteProduct();

    const total = ProductCtrl.getTotal();

    UICtrl.showTotal(total);

    StorageCtrl.deleteProduct(selectedProduct.id);

    UICtrl.addingState();

    if (total == 0) {
      UICtrl.hideCard();
    }

    e.preventDefault();
  };

  return {
    init: () => {
      console.log("starting app...");

      UICtrl.addingState();

      const products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }

      loadEventListeners();
    },
  };
})(ProductController, UIController, StorageController);

App.init();
