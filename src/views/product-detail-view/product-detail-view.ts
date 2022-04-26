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
	uuid: string;
}

export class ProductDetailView
{
	uuid;
	dataTags;

	activate( params: ViewParams )
	{
		this.uuid = params.uuid
	}

	data: ProductDataResponse;

	bind()
	{
		this.getData( this.uuid )

	}

	async getData( uuid )
	{
		const response = await fetch( `${environment.backendBaseUrl}product/single/${uuid}` );
		const data     = await response.json()
		this.data      = data;
		this.dataTags  = this.data.tags.join( " " )
	}
}
