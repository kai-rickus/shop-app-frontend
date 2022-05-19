import { bindable } from "aurelia-framework";
import { Tooltip }  from "bootstrap";
import environment  from "../../../environment";

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

export class ProductDetailsMain
{
	@bindable data: ProductDataResponse;


	submitting = false;

	attached()
	{
		this.initializeTooltips()
	}

	initializeTooltips()
	{
		const tooltipTriggerList = Array.from( document.querySelectorAll( '[data-bs-toggle="tooltip"]' ) )
		tooltipTriggerList.map( element => new Tooltip( element ) )
	}

}
