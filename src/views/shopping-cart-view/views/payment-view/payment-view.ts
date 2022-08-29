import { bindable } from "aurelia-framework";
import { Router }   from "aurelia-router";

export class PaymentView
{
	changeBackgroundColor( event )
	{
		const allRadioButtonbuttons  = document.querySelectorAll( ".radio-button-button" )
		const realRadioButtonButtons = Array.from( allRadioButtonbuttons )

		for( const radioButtonButton of realRadioButtonButtons )
		{
			radioButtonButton.classList.remove( "checkedPayment" )
		}
		event.currentTarget.parentElement.parentElement.parentElement.classList.add( "checkedPayment" )
	}
}
