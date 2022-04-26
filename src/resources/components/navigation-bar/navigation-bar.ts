import { autoinject } from "aurelia-framework";
import { Router }     from "aurelia-router";

@autoinject
export class NavigationBar
{
	constructor( private _router: Router ){}

	search( event )
	{
		this._router.navigateToRoute(
			"product-overview",
			{ searchString : event.detail.string }
		)
	}
}
