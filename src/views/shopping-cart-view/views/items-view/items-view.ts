import { autoinject, bindable } from "aurelia-framework";
import { BindingSignaler }      from "aurelia-templating-resources";
import environment              from "../../../../environment";
import { SIGNAL_CART_UPDATED }  from "../../../../resources/components/product-details-main/product-details-main";
import { ShopUser }             from "../../../../services/shop-user";

@autoinject()
export class ItemsView
{
	user: ShopUser

	constructor( user: ShopUser, private _signaler: BindingSignaler )
	{
		this.user = user;
	}


	async getCardItems()
	{
		const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
			headers : { "Authorization" : "Bearer " + this.user.accessToken }
		} );
		const data     = await response.json()
		return data.items
	}

	async setCartitems( itemId )
	{
		const response = await fetch( `${environment.backendBaseUrl}cart/set/${itemId}/0`, {
			method  : "put",
			headers : { "Authorization" : "Bearer " + this.user.accessToken }
		} );

		if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

		this._signaler.signal( SIGNAL_CART_UPDATED )
	}
}
