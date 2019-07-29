let storeGoods = [
	{ id:1, name:"Milk", price: 100, quantity: 3},
	{ id:2, name:"Matches", price: 20, quantity: 8},
	{ id:3, name:"Candle", price: 55, quantity: 4},
	{ id:4, name:"Jar", price: 80, quantity: 2},
];

let cartGoods = [
    { id:20, name:"Pencil", price: 30, quantity: 1},
];

let cartTotal = 0;


webix.ui({
	rows: [
		{ view:"toolbar", id:"testtoolbar", elements:[
			{ view:"button", value:"Add", width:70, click:save_row },
			{ view:"button", value:"Delete", width:70, click:delete_row},
            { view:"button", value:"Clear", width:70, click:() => $$("testform").clear()},
            { view:"button", value:"Buy", width:70, click:buyOne},
            { view:"button", value:"Buy All", width:80, click:buyAll},
            { view:"button", value:"Drop", width:70, click:dropOne},
            { view:"button", value:"Drop All", width:80, click:dropAll} ]
		},
		{ cols:[
            {view:"form", id:"testform", width:200, 
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
                    data: cartGoods
                },
                {
                    view:"label",
                    id:"totalLabel",
                    label:" Cart Total: 0"
                },
            ]
            },
        ]},
	]
}); 

function save_row(){
    const values = $$("testform").getValues();
    values.price = parseInt(values.price);
    values.quantity = parseInt(values.quantity);
    $$("storeList").add(values);
    $$("testform").clear();
}

function delete_row(){
    let id = $$("storeList").getSelectedId();
    $$("storeList").remove(id);
}

function buyAll(){
    let id = $$("storeList").getSelectedId();
    let boughtItem = $$("storeList").getItem(id);
    $$("cartList").add(boughtItem);
    $$("storeList").remove(id);
    cartTotal += boughtItem.price * boughtItem.quantity;
    refreshCartTotal();
}

function buyOne(){
    let id = $$("storeList").getSelectedId();
    let boughtItem = $$("storeList").getItem(id);
    if (boughtItem.quantity === 0) {
        return;
    }
    boughtItem.quantity--;
    $$("storeList").updateItem(id, boughtItem);
    if ($$("cartList").exists(id)) {
        let cartItem = $$("cartList").getItem(id);
        cartItem.quantity++;
        $$("cartList").updateItem(id, cartItem);
    } else {
        $$("cartList").add({
                id: boughtItem.id, 
                name: boughtItem.name, 
                price: boughtItem.price,
                quantity: 1,
            });
    }
    cartTotal += boughtItem.price;
    refreshCartTotal();
}

function dropAll(){
    let id = $$("cartList").getSelectedId();
    let droppedItem = $$("cartList").getItem(id);
    console.log($$("storeList").data);
    if ($$("storeList").exists(id)) {
        let storeItem = $$("storeList").getItem(id);
        storeItem.quantity += droppedItem.quantity;
        $$("storeList").updateItem(id, storeItem);
    } else {
        $$("storeList").add({
            id: droppedItem.id,
            name: droppedItem.name,
            price: droppedItem.price,
            quantity: droppedItem.quantity,
        })
    }
    cartTotal -= droppedItem.price * droppedItem.quantity;
    $$("cartList").remove(id);
    refreshCartTotal();
}

function dropOne(){

}

function refreshCartTotal(){
    $$("totalLabel").setValue("Cart Total: " + cartTotal);
}