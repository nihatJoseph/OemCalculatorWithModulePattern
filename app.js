// STORAGE CONTROLLER MODULE

const StorageController = (() => { })();


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
      console.log(data)
      return data;
    },
    addProduct: (name, price) => {
      let id;
      if (data.products.length > 0) {
        id = data.products[data.products.length-1].id+1
      } else {
        id = 0
      }
      const newProduct = new Product(id, name, parseFloat(price))
      data.products.push(newProduct)
      return newProduct
    },
    getTotal: () => {
      let total = 0
      
      data.products.forEach((item) => {
        total+=item.price
      })
      data.totalPrice = total
      return data.totalPrice
    }
  };
})();


// UI MODULE

const UIController = (() => {
  const Selectors = {
      productList: "#item-list",
      addButton: ".addBtn",
      productName: "#productName",
      productPrice: "#productPrice",
    productCard: "#productCard",
    totalTl: "#total-tl",
      totalDollar: "#total-dollar"
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
                        <button type="submit" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i>
                        </button>
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
      document.querySelector(Selectors.productCard).style.display="block"
      let item = `
      <tr>
        <td>${prd.id}</td>
        <td>${prd.name} </td>
        <td>${prd.price} $</td>
        <td class="text-end">
            <button type="submit" class="btn btn-warning btn-sm">
                <i class="fas fa-edit"></i>
            </button>
        </td>
      </tr>
      `;
      document.querySelector(Selectors.productList).innerHTML+=item
    },
    clearInputs: () => {
      document.querySelector(Selectors.productName).value = ""
      document.querySelector(Selectors.productPrice).value = ""

    },
    hideCard: () => {
      document.querySelector(Selectors.productCard).style.display="none"
    },
    showTotal: (total) => {
      document.querySelector(Selectors.totalDollar).textContent = total
      document.querySelector(Selectors.totalTl).textContent=total*15
    }
  };
})();


// APP MODULE

const App = ((ProductCtrl, UICtrl) => {
    const UISelectors = UIController.getSelectors() // ui ctrl ve uicontroller kullanmak arasında ne fark var?
    
    const loadEventListeners = () => {
      document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit)
    }

    const productAddSubmit = (e) => {
        
      const productName = document.querySelector(UISelectors.productName).value
      const productPrice = document.querySelector(UISelectors.productPrice).value
      
      if (productName !== "" && productPrice !== "") {
        const newProduct = ProductCtrl.addProduct(productName, productPrice) //buradaki new product ile productcontroller modulesinden return edilen new product'ın bağlantısı ne?
        // UICtrl.createProductList(newProduct) bunu burada neden kullanamıyorum, foreach ile olan sıkıntısı ne?

        UIController.addProduct(newProduct)

        const total = ProductCtrl.getTotal()
        
        UICtrl.showTotal(total)

        UIController.clearInputs()
      }
          
        e.preventDefault()
    }

  return {
    init: () => {
      console.log("starting app...");
      const products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard()
      } else {
        UICtrl.createProductList(products);
        
      }

      loadEventListeners()
          
          
    },
  };
})(ProductController, UIController);

App.init();

