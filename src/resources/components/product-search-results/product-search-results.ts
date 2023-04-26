import { bindable } from "aurelia-framework";
import { debug }    from "util";
import environment  from "../../../environment";

export class ProductSearchResults
{
	@bindable search: string
	@bindable limit: number
	@bindable exclude: string[] = []
	@bindable noShadow          = false

	public products: [];
	private _nothingFound = false;

	public searchChanged( value: string )
	{
		if( value === undefined ) return

		this.loadResults( this.search );
	}

	async loadResults( searchString )
	{
		this.products      = await this.getProducts( searchString );
		this._nothingFound = this.products.length === 0;

	}

	async getProducts( searchString )
	{
		try
		{
			const response = await fetch( `${environment.searchBaseUrl}search?query=${searchString}&limit=${this.limit}`, {
				method  : "POST",
				body    : JSON.stringify( { exclude : this.exclude } ),
				headers : { 'Content-Type' : 'application/json' },
			} );
			const data     = await response.json()

			return data.result;
		}
		catch( error )
		{
			/* TODO: error handling */
		}
	}
}
