import { bindable } from "aurelia-framework";
import environment  from "../../environment";

interface ProductDataResponse
{
	active: boolean;
	description: string;
	id: number;
	image: string;
	price: number;
	rating: number;
	ratingsCount: number;
	shipment: string;
	tags: string[];
	title: string;
	uuid: string;
}

interface ViewParams
{
	id: string;
}

export class ProductDetailView
{
	id;
	dataTags;

	activate( params: ViewParams )
	{
		this.id = params.id
	}

	data: ProductDataResponse;

	bind()
	{
		this.getData( this.id )

	}

	async getData( id )
	{
		const response = await fetch( `${environment.backendBaseUrl}product/single/${id}` );
		const data     = await response.json()
		this.data      = data;
		this.dataTags  = this.data.tags.join( " " )
	}
}
