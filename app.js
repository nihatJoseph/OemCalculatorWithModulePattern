// STORAGE CONTROLLER MODULE

const StorageController = (() => {})();

// PRODUCT CONTROLLER MODULE

const ProductController = (() => {
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: [],
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

const App = ((ProductCtrl, UICtrl) => {
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
  };

  const productAddSubmit = (e) => {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== "" && productPrice !== "") {
      const newProduct = ProductCtrl.addProduct(productName, productPrice);

      UIController.addProduct(newProduct);

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

      UICtrl.addingState();
    }

    e.preventDefault();
  };

  const cancelUpdate = (e) => {
    UICtrl.addingState();
    UICtrl.clearWarnings();

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
})(ProductController, UIController);

App.init();
