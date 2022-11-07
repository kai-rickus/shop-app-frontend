import { autoinject }       from "aurelia-framework";
import { TaskQueue }        from "aurelia-task-queue";
import { ShoppingCartView } from "../../shopping-cart-view";

@autoinject()
export class PaymentView
{
	loading         = false;
	payments        =
		[
			{
				name        : "paypal",
				displayName : "PayPal",
				selected    : true
			},
			{
				name        : "apple-pay",
				displayName : "Apple Pay",
				selected    : false
			},
			{
				name        : "american-express",
				displayName : "American Express",
				selected    : false
			},
			{
				name        : "google-pay",
				displayName : "Google Pay",
				selected    : false
			},
			{
				name        : "maestro",
				displayName : "Maestro",
				selected    : false
			},
			{
				name        : "mastercard",
				displayName : "Mastercard",
				selected    : false
			},
			{
				name        : "visa",
				displayName : "Visacard",
				selected    : false
			},
		]
	selectedPayment = this.payments.find( item => item.selected );

	constructor( private _shoppingCartView: ShoppingCartView, private _taskqueue: TaskQueue )
	{}

	attached()
	{
		this._shoppingCartView.setHeightAfterRouting()
	}

	dummyMethod()
	{
		this._taskqueue.queueTask( async () =>
		{
			this._shoppingCartView.setHeightAfterRouting()
		} )
	}

	async radioChanged( id: string )
	{
		this.loading = true;

		// await this.setSelectedAddress( id );

		this.loading = false;
	}

	// changeBackgroundColor( event )
	// {
	// 	const allRadioButtonbuttons  = document.querySelectorAll( ".radio-button-button" )
	// 	const realRadioButtonButtons = Array.from( allRadioButtonbuttons )
	//
	// 	for( const radioButtonButton of realRadioButtonButtons )
	// 	{
	// 		radioButtonButton.classList.remove( "checkedPayment" )
	// 	}
	// 	event.currentTarget.parentElement.parentElement.parentElement.classList.add( "checkedPayment" )
	// }
}
