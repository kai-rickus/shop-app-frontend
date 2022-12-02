import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";
import { SIGNAL_CART_UPDATED }  from "../product-details-main/product-details-main";

@autoinject()
export class ShopItemAmount
{
	@bindable to;
	@bindable value;
	@bindable id;
	@bindable disabled = false;
	@bindable callback;
	@bindable from;
	@bindable transform = false;

	previousValue;
	textfield;

	constructor(
		private _user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue,
	)
	{}

	attached()
	{
		if( this.value >= this.to )
		{
			this.transform = true;
		}

		this.previousValue = this.value
	}

	// async setCartItems( id, value )
	// {
	// console.log("to:",this.to);
	// console.log("value:",this.value);
	// console.log("from:",this.from);
	// 	debugger
	//
	// if( value === "" )
	// {
	// 	this.value = this.previousValue
	//
	// 	return
	// }
	//
	// if( this.value === this.to )
	// {
	// 	this.transform = true;
	//
	// 	this._taskqueue.queueMicroTask( () =>
	// 	{
	// 		this.value = ""
	//
	// 		this.textfield.focus()
	// 	} )
	//
	// 	return
	// }
	// if( this.callback === undefined ) return
	// }
}
