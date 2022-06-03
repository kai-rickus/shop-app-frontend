import { bindable } from "aurelia-framework";
import { debug }    from "util";
import environment  from "../../../environment";

export class ProductSearchResults
{
	products;
	@bindable search
	@bindable limit
	@bindable exclude  = []
	@bindable noShadow = false

	attached()
	{
		this.loadResults( this.search );
	}

	async loadResults( searchString )
	{
		this.products = await this.getProducts( searchString );
	}

	async getProducts( searchString )
	{
		const response = await fetch( `${environment.searchBaseUrl}search?query=${searchString}&limit=${this.limit}`, {
			method  : "POST",
			body    : JSON.stringify( { exclude : this.exclude } ),
			headers : { 'Content-Type' : 'application/json' },
		} );
		const data     = await response.json()

		return data.result;
	}
}
