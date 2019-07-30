// Стартовое значение для списка товаров на складе
let storeGoods = [
	{ id:1, name:"Milk", price: 100, quantity: 3},
	{ id:2, name:"Matches", price: 20, quantity: 8},
	{ id:3, name:"Candle", price: 55, quantity: 4},
	{ id:4, name:"Jar", price: 80, quantity: 2},
];

// Стартовое значение для списка товаров в корзине
let cartGoods = [
    { id:20, name:"Pencil", price: 30, quantity: 1},
];

let cartTotal = cartGoods.reduce((total, current) => {
    return total + current.price * current.quantity;
}, 0);


webix.ui({
	rows: [
		{ view:"toolbar", id:"testtoolbar", elements:[
			{ view:"button", value:"Add", width:70, click:addEntry },
			{ view:"button", value:"Delete", width:70, click:deleteEntry},
            { view:"button", value:"Clear", width:70, click:() => $$("testForm").clear()},
            { view:"button", value:"Buy", width:70, click:buyOne},
            { view:"button", value:"Buy All", width:80, click:buyAll},
            { view:"button", value:"Drop", width:70, click:dropOne},
            { view:"button", value:"Drop All", width:80, click:dropAll} ]
		},
		{ cols:[
            {view:"form", id:"testForm", width:200, 
            elements:[
				{ view:"text", name:"name", placeholder:"Name", width:180, align:"center"}, 
                { view:"text", name:"price", placeholder:"400", width:180, align:"center"},
                { view:"text", name:"quantity", placeholder:"10", width:180, align:"center"}
            ],
			},
			{
				view:"list", 
				id:"storeList",
				template:"#name# - #price# - #quantity#", 
				select:true,
				height:450,
				data: storeGoods
            },
            { rows:[
                {
                    view:"list",
                    id:"cartList",
                    template:"#name# - #price# - #quantity#",
                    select:true,
                    height:400,
                    data: cartGoods,
                },
                {
                    view:"label",
                    id:"totalLabel",
                    label:"Cart Total: " + cartTotal,
                },
            ]
            },
        ]},
	]
}); 

/**
 * Обработчик события "click" кнопки "Add".
 * Добавляет запись из формы "testForm" в список товаров на складе.
 */
function addEntry(){
    const values = $$("testForm").getValues();
    values.price = parseInt(values.price);
    values.quantity = parseInt(values.quantity);
    $$("storeList").add(values);
    $$("testForm").clear();
}

/**
 * Обработчик события "click" кнопки "Delete".
 * Удаляет выделенную запись из списка товаров на складе.
 */
function deleteEntry(){
    let id = $$("storeList").getSelectedId();
    $$("storeList").remove(id);
}

/**
 * Обработчик события "click" кнопки "Buy All".
 * Перемещает весь товар из выделенной записи на складе в корзину.
 */
function buyAll(){
    let id = $$("storeList").getSelectedId();
    let boughtItem = $$("storeList").getItem(id);
    
    if (boughtItem === undefined || boughtItem.quantity === 0) {
        return;
    }

    if ($$("cartList").exists(id)) {
        let cartItem = $$("cartList").getItem(id);
        cartItem.quantity += boughtItem.quantity;
        $$("cartList").updateItem(id, cartItem);
    } else {
        let cartItem = {};
        Object.assign(cartItem, boughtItem);
        $$("cartList").add(cartItem);
    }
    cartTotal += boughtItem.price * boughtItem.quantity;
    boughtItem.quantity = 0;
    $$("storeList").updateItem(id, boughtItem);
    refreshCartTotal();
}

/**
 * Обработчик события "click" кнопки "Buy".
 * Перемещает одну единицу товара из выделенной записи на складе в корзину.
 */
function buyOne(){
    let id = $$("storeList").getSelectedId();
    let boughtItem = $$("storeList").getItem(id);

    if (boughtItem === undefined || boughtItem.quantity === 0) {
        return;
    }

    boughtItem.quantity--;
    $$("storeList").updateItem(id, boughtItem);
    if ($$("cartList").exists(id)) {
        let cartItem = $$("cartList").getItem(id);
        cartItem.quantity++;
        $$("cartList").updateItem(id, cartItem);
    } else {
        let cartItem = {};
        Object.assign(cartItem, boughtItem);
        cartItem.quantity = 1;
        $$("cartList").add(cartItem);
    }
    cartTotal += boughtItem.price;
    refreshCartTotal();
}

/**
 * Обработчик события "click" кнопки "Drop All".
 * Перемещает весь товар из выделенной записи в корзине на склад.
 * Запись в корзине при этом удаляется.
 */
function dropAll(){
    let id = $$("cartList").getSelectedId();
    let droppedItem = $$("cartList").getItem(id);
    if (droppedItem === undefined) {
        return;
    }

    if ($$("storeList").exists(id)) {
        let storeItem = $$("storeList").getItem(id);
        storeItem.quantity += droppedItem.quantity;
        $$("storeList").updateItem(id, storeItem);
    } else {
        let storeItem = {};
        Object.assign(storeItem, droppedItem);
        $$("storeList").add(storeItem);
    }
    cartTotal -= droppedItem.price * droppedItem.quantity;
    $$("cartList").remove(id);
    refreshCartTotal();
}

/**
 * Обработчик события "click" кнопки "Drop".
 * Перемещает одну единицу товара из выделенной записи в корзине на склад.
 * Если данная единица была последней, запись удаляется из корзины.
 */
function dropOne(){
    let id = $$("cartList").getSelectedId();
    let droppedItem = $$("cartList").getItem(id);
    if (droppedItem === undefined) {
        return;
    }

    if ($$("storeList").exists(id)) {
        let storeItem = $$("storeList").getItem(id);
        storeItem.quantity++;
        $$("storeList").updateItem(id, storeItem);
    } else {
        let storeItem = {};
        Object.assign(storeItem, droppedItem);
        storeItem.quantity = 1;
        $$("storeList").add(storeItem);
    }
    droppedItem.quantity--;
    cartTotal -= droppedItem.price;
    if (droppedItem.quantity) {
        $$("cartList").updateItem(id, droppedItem);
    } else {
        $$("cartList").remove(id);
    }
    refreshCartTotal();
}

/**
 * Обновляет отображение "totalLabel" текущим значением 
 * итоговой суммы корзины.
 */
function refreshCartTotal(){
    $$("totalLabel").setValue("Cart Total: " + cartTotal);
}