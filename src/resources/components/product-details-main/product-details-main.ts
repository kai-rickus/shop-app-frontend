import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import { Tooltip, Toast }       from "bootstrap";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";

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

@autoinject()
export class ProductDetailsMain
{
	@bindable data: ProductDataResponse;
	dropdownOption;
	submitting = false;
	toast;

	constructor( private _router: Router, private _user: ShopUser ){}

	attached()
	{
		this.initializeTooltips()

		const toastLiveExample = document.querySelector( '#liveToast' )
		this.toast             = new Toast( toastLiveExample )
	}

	initializeTooltips()
	{
		const tooltipTriggerList = Array.from( document.querySelectorAll( '[data-bs-toggle="tooltip"]' ) )
		tooltipTriggerList.map( element => new Tooltip( element ) )
	}

	async addToCart()
	{
		this.submitting = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/add/${this.data.id}/${this.dropdownOption.value}`, {
				method  : "put",
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

			this.toast.show()
		}
		catch( error )
		{
			/* TODO: Implement User communication */
			console.log( "Error ", error );
		}

		this.submitting = false
	}
}
