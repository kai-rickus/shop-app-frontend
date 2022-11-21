import { autoinject }       from "aurelia-framework";
import { TaskQueue }        from "aurelia-task-queue";
import { BindingSignaler }  from "aurelia-templating-resources";
import environment          from "../../../../environment";
import { ShopUser }         from "../../../../services/shop-user";
import { ShoppingCartView } from "../../shopping-cart-view";

@autoinject()
export class PaymentView
{
	loading  = false;
	payments =
		[
			{
				id          : "paypal",
				displayName : "PayPal",
				selected    : false
			},
			{
				id          : "apple-pay",
				displayName : "Apple Pay",
				selected    : false
			},
			{
				id          : "american-express",
				displayName : "American Express",
				selected    : true
			},
			{
				id          : "google-pay",
				displayName : "Google Pay",
				selected    : false
			},
			{
				id          : "maestro",
				displayName : "Maestro",
				selected    : false
			},
			{
				id          : "mastercard",
				displayName : "Mastercard",
				selected    : false
			},
			{
				id          : "visa",
				displayName : "Visacard",
				selected    : false
			},
		]
	errorDialog;

	static SIGNAL_PAYMNETS_UPDATED         = "payments-updated"
	static SIGNAL_PAYMNETS_LOCALLY_CHANGED = "payments-locally-changed"

	selectedPayment = this.payments.find( item => item.selected );

	constructor(
		private _shoppingCartView: ShoppingCartView,
		private _signaler: BindingSignaler,
		private _taskqueue: TaskQueue,
		public user: ShopUser,
	)
	{}

	attached()
	{
		this._taskqueue.queueTask( async () => {this._shoppingCartView.setHeightAfterRouting()} )
	}

	async load()
	{
		// this.payments = []
		//
		// this._signaler.signal( PaymentView.SIGNAL_PAYMNETS_LOCALLY_CHANGED )
		//
		// this.loading = true;
		//
		// try
		// {
		// 	/* TODO: richtige Backendanbindung */
		// 	const response = await fetch( `${environment.backendBaseUrl}user/addresses`, {
		//
		// 		headers : { "Authorization" : "Bearer " + this.user.accessToken }
		// 	} );
		//
		// 	if( !response.ok ) throw new Error( `Server returned status ${response.status}` );
		//
		// 	const json = await response.json();
		//
		// 	this.payments        = json.addresses;
		// 	this.selectedPayment = this.payments.find( item => item.selected );
		//
		// 	this._signaler.signal( PaymentView.SIGNAL_PAYMNETS_LOCALLY_CHANGED )
		// }
		// catch( error )
		// {
		// 	this.errorDialog.open()
		// }
		// this.loading = false;
		//
		// this._taskqueue.queueTask( async () =>
		// {
		// 	this._shoppingCartView.setHeightAfterRouting()
		// } )
	}

	async radioChanged( id: string )
	{
		this.loading = true;

		// await this.setSelectedPayment( id );

		this.loading = false;
	}

	// async setSelectedPayment( id: string )
	// {
	// 	try
	// 	{
	// 		/* TODO: richtige Backendanbindung */
	// 		const response = await fetch( `${environment.backendBaseUrl}user/addresses/setSelected/${id}`, {
	// 			method  : "post",
	// 			headers : { "Authorization" : "Bearer " + this.user.accessToken }
	// 		} );
	//
	// 		if( !response.ok )
	// 		{
	// 			const json    = await response.json();
	// 			const message = json?.error || response.status;
	//
	// 			throw new Error( `Server returned: ${message}` );
	// 		}
	// 	}
	// 	catch( error )
	// 	{
	// 		this.errorDialog.open()
	// 	}
	// }
}
