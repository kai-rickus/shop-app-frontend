import { bindable } from "aurelia-framework";
import environment  from "../../../environment";

export class ProductTiles
{
	products;
	@bindable search
	@bindable limit

	bind()
	{
		this.loadResults( this.search );
	}

	async loadResults( searchString )
	{
		this.products = await this.getProducts( searchString );
	}

	async getProducts( searchString )
	{
		const response = await fetch( `${environment.searchBaseUrl}search?query=${searchString}&limit=${this.limit}` );
		const data     = await response.json()

		return data.result;
	}
}
