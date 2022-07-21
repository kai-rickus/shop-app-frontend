import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import { Tooltip }              from "bootstrap";
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

	constructor( private _router: Router, private _user: ShopUser ){}

	attached()
	{
		this.initializeTooltips()
	}

	initializeTooltips()
	{
		const tooltipTriggerList = Array.from( document.querySelectorAll( '[data-bs-toggle="tooltip"]' ) )
		tooltipTriggerList.map( element => new Tooltip( element ) )
	}

	async addToCart()
	{
		const response = await fetch( `${environment.backendBaseUrl}cart/add/${this.data.id}/${this.dropdownOption.value}`, {
			method  : "put",
			headers : { "Authorization" : "Bearer " + this._user.accessToken }
		} );
		const status   = await response.text()

		if( status === "Cart successfully updated." )
		{
			// const toastTrigger = document.getElementById('liveToastBtn')
			// const toastLiveExample = document.getElementById('liveToast')
			// if (toastTrigger) {
			// 	toastTrigger.addEventListener('click', () => {
			// 		const toast = new bootstrap.Toast(toastLiveExample)
			//
			// 		toast.show()
			// 	})
			// }
		}
	}
}
