import { bindable } from "aurelia-framework";
import environment  from "../../../environment";

export class ProductTiles
{
	products;
	@bindable search
	@bindable limit
	@bindable exclude = []

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
		debugger
		const response = await fetch( `${environment.searchBaseUrl}search?query=${searchString}&limit=${this.limit}`, {
			method  : "POST",
			body    : JSON.stringify( { exclude : this.exclude } ),
			headers : { 'Content-Type' : 'application/json' },
		} );
		const data     = await response.json()

		return data.result;
	}
}
