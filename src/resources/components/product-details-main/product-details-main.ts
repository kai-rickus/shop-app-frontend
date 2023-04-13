import { MdcSnackbarService }   from "@aurelia-mdc-web/snackbar";
import { autoinject, bindable } from "aurelia-framework";
import { Router }               from "aurelia-router";
import { TaskQueue }            from "aurelia-task-queue";
import { BindingSignaler }      from "aurelia-templating-resources";
import { Tooltip }              from "bootstrap";
import { debug }                from "util";
import environment              from "../../../environment";
import { ShopUser }             from "../../../services/shop-user";
import { ShoppingCartView }     from "../../../views/shopping-cart-view/shopping-cart-view";

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

export const SIGNAL_CART_UPDATED = "cart-updated";

@autoinject()
export class ProductDetailsMain
{

	private readonly _LOGIN_STATE_CHANGED_SIGNAL = ShopUser.LOGIN_STATE_CHANGED_SIGNAL

	@bindable data: ProductDataResponse;

	submitting        = false;
	amount            = 1;
	favorizePending   = false;

	snackbarSuccessMessage         = "Artikel hinzugefügt!";
	snackbarSuccessMessageDuration = 10000;
	snackbarErrorMessage           = "Fehler! Bitte versuche es später erneut.";
	snackbarErrorMessageDuration   = -1;

	favorized;
	textfield;
	transform = false;
	previousValue;
	value;
	to        = 10;
	from      = 1;

	constructor(
		private _shoppingCart: ShoppingCartView,
		private _signaler: BindingSignaler,
		private _taskqueue: TaskQueue,
		private _router: Router,
		private _user: ShopUser,
		private snackbar: MdcSnackbarService,
	)
	{}

	attached()
	{
		this.initializeFavorite()
		this.initializeTooltips()

		this.previousValue = this.value
	}

	async initializeFavorite()
	{
		const url      = `${environment.backendBaseUrl}product/getFavorite/${this.data.id}`
		const response = await fetch( url, {
			headers : { "Authorization" : "Bearer " + this._user.accessToken }
		} );
		const data     = await response.json()

		this.favorized = data.favorized;
	}

	initializeTooltips()
	{
		const tooltipTriggerList = Array.from( document.querySelectorAll( '[data-bs-toggle="tooltip"]' ) )
		tooltipTriggerList.map( element => new Tooltip( element ) )
	}

	async addToCart()
	{
		this.submitting = true
		this.favorizePending = true

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}cart/add/${this.data.id}/${this.amount}`, {
				method  : "put",
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` )

			this.submitting = false

			this.snackbar.open( this.snackbarSuccessMessage, 'Okay', {
				timeout : this.snackbarSuccessMessageDuration,
			} );

			this._signaler.signal( SIGNAL_CART_UPDATED )
		}
		catch( error )
		{
			/* TODO: Nochmal versuchen */
			this.snackbar.open( this.snackbarErrorMessage, 'Okay', {
				timeout : this.snackbarErrorMessageDuration,
			} );

			this.submitting      = false;
			this.favorizePending = false;
		}

	}

	async setFavorite( favorize )
	{
		this.favorizePending = true

		try
		{
			const url      = `${environment.backendBaseUrl}product/setFavorite/${this.data.id}/${favorize}`
			const response = await fetch( url, {
				method  : "post",
				headers : { "Authorization" : "Bearer " + this._user.accessToken }
			} );

			if( !response.ok ) throw new Error( `Server returned status ${response.status}` )
		}
		catch( error )
		{
			/* TODO: error handling */
		}

		this.favorizePending = false
	}
}
