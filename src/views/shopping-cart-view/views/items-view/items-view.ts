import { autoinject, bindable } from "aurelia-framework";
import environment              from "../../../../environment";
import { ShopUser }             from "../../../../services/shop-user";

@autoinject()
export class ItemsView
{
	user: ShopUser
	items = [];

	constructor( user: ShopUser )
	{
		this.user = user;
	}

	async attached()
	{
		this.items = await this.getCardItems()
	}

	async getCardItems()
	{
		const response = await fetch( `${environment.backendBaseUrl}cart/get`, {
			headers : { "Authorization" : "Bearer " + this.user.accessToken }
		} );
		const data     = await response.json()
		return data.items
	}
}
