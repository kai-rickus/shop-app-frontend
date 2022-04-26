import { bindable, autoinject } from "aurelia-framework";
import { Router }               from "aurelia-router";

@autoinject()
export class ProductTilesItem
{
	shoppingCartLabel = "In Warenkorb";
	@bindable title;
	@bindable price;
	@bindable thumbnail;
	@bindable uuid;

	router;

	constructor( router: Router )
	{
		this.router = router;
	}

	goToDetails( uuid )
	{
		this.router.navigateToRoute( "product-detail", { uuid : uuid } )
	}

}
