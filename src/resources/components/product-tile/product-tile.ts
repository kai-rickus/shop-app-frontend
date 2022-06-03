import { bindable, autoinject } from "aurelia-framework";
import { Router }               from "aurelia-router";

@autoinject()
export class ProductTile
{
	shoppingCartLabel = "In Warenkorb";
	@bindable title;
	@bindable price;
	@bindable thumbnail;
	@bindable id;

	router;

	constructor( router: Router )
	{
		this.router = router;
	}

}
