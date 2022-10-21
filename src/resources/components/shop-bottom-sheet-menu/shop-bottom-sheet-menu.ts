import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import { App }                  from "../../../app";

@autoinject
export class ShopBottomSheetMenu
{
	static SCRIM_INTERACTION_EVENT_TYPE = "scrim-interaction"

	@bindable disableRouting = false

	element;

	constructor( public app: App, public router: Router ){}

	attached()
	{
		this.app.toggleScroll( false )
	}

	detached()
	{
		this.app.toggleScroll( true )
	}

	private _close()
	{
		const event = new CustomEvent( ShopBottomSheetMenu.SCRIM_INTERACTION_EVENT_TYPE )

		this.element.dispatchEvent( event )
	}
}
