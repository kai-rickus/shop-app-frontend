import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";
import { SIGNAL_CART_UPDATED }  from "../product-details-main/product-details-main";
import { MdcTextField }         from "@aurelia-mdc-web/text-field";

@autoinject()
export class ShopItemAmount
{
	@bindable menuSelectAmount = 10;
	@bindable productAmount;
	@bindable productId;

	user: ShopUser
	previousProductAmount;
	textfield;
	disabled  = false;
	transform = false;

	private _mdcTextField: MdcTextField;

	constructor(
		user: ShopUser,
		private _signaler: BindingSignaler,
		private _shoppingCart: ShoppingCartView,
		private _taskqueue: TaskQueue,
	)
	{
		this.user = user;
	}

	attached()
	{
		if( this.productAmount >= this.menuSelectAmount )
		{
			this.transform = true;
		}

		console.log( this.textfield );

		this.previousProductAmount = this.productAmount
	}

	async setCartItems( id, amount )
	{
		if( amount === "" )
		{
			this.productAmount = this.previousProductAmount
			return
		}

		if( this.productAmount === this.menuSelectAmount )
		{
			console.log( this.textfield )

			this.transform = true;
			this.textfield.focus()
			return
		}

		this.disabled = true

		const response = await fetch( `${environment.backendBaseUrl}cart/set/${id}/${amount}`, {
			method  : "put",
			headers : { "Authorization" : "Bearer " + this.user.accessToken }
		} );

		if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

		this.disabled = false

		this._signaler.signal( SIGNAL_CART_UPDATED )
	}
}
