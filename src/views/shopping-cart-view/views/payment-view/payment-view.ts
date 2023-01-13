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
	payments = [];
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

		this.payments = []

		this._signaler.signal( PaymentView.SIGNAL_PAYMNETS_LOCALLY_CHANGED )

		this.loading = true;

		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/payments`, {
				headers : { "Authorization" : "Bearer " + this.user.accessToken }
			} );
			if( !response.ok ) throw new Error( `Server returned status ${response.status}` );

			const json = await response.json();

			this.payments = json.payments;
			debugger
			this.selectedPayment = this.payments.find( item => item.selected );

			this._signaler.signal( PaymentView.SIGNAL_PAYMNETS_LOCALLY_CHANGED )
		}
		catch( error )
		{
			console.log( "Fehler" );
			// this.errorDialog.open()
		}
		this.loading = false;

		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )
	}

	async radioChanged( id: string )
	{
		this.loading = true;
		await this.setSelectedPayment( id );

		this.loading = false;
	}

	async setSelectedPayment( id: string )
	{
		try
		{
			const response = await fetch( `${environment.backendBaseUrl}user/payments/setSelected/${id}`, {
				method  : "post",
				headers : { "Authorization" : "Bearer " + this.user.accessToken }
			} );

			if( !response.ok )
			{
				const json    = await response.json();
				const message = json?.error || response.status;

				throw new Error( `Server returned: ${message}` );
			}
		}
		catch( error )
		{
			this.errorDialog.open()
		}
	}
}
