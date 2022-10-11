import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import { App }                  from "../../../app";

@autoinject
export class ShopBottomSheetMenu
{
	@bindable route

	constructor( public app: App, public router: Router ){}

	attached()
	{
		this.app.toggleScroll( false )
	}

	detached()
	{
		this.app.toggleScroll( true )
	}

	close()
	{
		if( !this.route ) return this.router.navigateBack()

		this.router.navigateToRoute( this.route )
	}
}
