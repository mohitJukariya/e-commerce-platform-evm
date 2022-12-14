// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

contract Invoice {

    struct Product {
        string title;
        string desc;
        address payable sellerPAN;
        uint productId;
        uint price;
        address buyerPAN;
        bool registered; // registered means product registered by seller
        bool bought;     // bought means product bought by buyer
    }

    uint counter = 1;
    Product[] private products;
    address[] private buyers;

    mapping(address => bool) isBuyer;
    mapping(address => uint) noOfItemsBoughtByBuyer;
    mapping(address => uint[]) productIdOfItemsBoughtByBuyer;
    mapping(address => mapping(uint => Product)) detailsOfProductBoughtByBuyer;
    mapping(address => mapping(uint => bool)) paymentStatus;


    event registered(string title, uint productId, address sellerPAN);
    event bought(uint productId, address buyerPAN);
    
    function registerProduct(string memory _title, string memory _desc, uint _price) public {
        require(_price > 0, 'The Price should be greater than zero');
        Product memory tempProduct;
        tempProduct.title = _title;
        tempProduct.desc = _desc;
        tempProduct.price = _price * 10 ** 18;
        tempProduct.sellerPAN = payable(msg.sender);
        tempProduct.productId = counter;
        tempProduct.registered = true;
        products.push(tempProduct);
        counter++;
        emit registered(_title, tempProduct.productId, msg.sender);
    }

    function buy(uint _productId) payable public{
        require(products[_productId-1].price == msg.value, 'Pay the exact amount of the product');
        require(products[_productId-1].sellerPAN != msg.sender, 'sellerPAN cannot be the buyerPAN');
        products[_productId-1].buyerPAN = msg.sender;
        products[_productId-1].bought = true;
        if(isBuyer[msg.sender] == false){
            buyers.push(msg.sender);
            isBuyer[msg.sender] == true;
        }
        noOfItemsBoughtByBuyer[msg.sender] += 1;
        productIdOfItemsBoughtByBuyer[msg.sender].push(_productId);
        detailsOfProductBoughtByBuyer[msg.sender][_productId] = products[_productId-1];
        require(products[_productId-1].buyerPAN == msg.sender, 'Only buyerPAN can confirm it');
        products[_productId-1].sellerPAN.transfer(products[_productId-1].price);
        paymentStatus[msg.sender][_productId] = true;
        emit bought(_productId, msg.sender);
    }

    function noOfItemsBoughtBy(address _address) public view returns(uint) {
        return noOfItemsBoughtByBuyer[_address];
    }

    function getProductIdOfItemsBoughtByBuyer(address _address) public view returns(uint[] memory) {
        return productIdOfItemsBoughtByBuyer[_address];
    }
    
    function getDetailsOfProductBoughtBy(address _address, uint _productId) public view returns(Product memory){
        return detailsOfProductBoughtByBuyer[_address][_productId];
    }

    function checkPaymentStatus(address _address, uint _productId) public view returns(bool) {
        return paymentStatus[_address][_productId];
    }
    
}
