import { IMdcTextFieldElement } from "@aurelia-mdc-web/text-field/dist/types/mdc-text-field";
import { autoinject }           from 'aurelia-framework';

@autoinject()
export class MdcTextfieldMinlengthCustomAttribute
{
	constructor( private element: Element ){ }

	valueChanged( newValue: string, oldValue: string )
	{
		const textfield = ( this.element as IMdcTextFieldElement ).au.controller.viewModel;
		const input     = textfield.input_;

		if( input )
		{
			input.setAttribute( 'minlength', newValue );

			return
		}

		const intervalId = setInterval( () =>
		{
			const input = textfield.input_;

			if( !input ) return

			clearInterval( intervalId )

			input.setAttribute( 'minlength', newValue );

		}, 50 )
	}
}
