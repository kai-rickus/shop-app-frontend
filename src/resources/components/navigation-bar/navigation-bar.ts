import { autoinject } from "aurelia-framework";
import { Router }     from "aurelia-router";
import { ShopUser }   from "../../../services/shop-user";

@autoinject
export class NavigationBar
{
	constructor( private _router: Router, private _user: ShopUser ){
		(window as any).user = _user;
	}

	search( event )
	{
		this._router.navigateToRoute(
			"product-overview",
			{ searchString : event.detail.string }
		)
	}
}
