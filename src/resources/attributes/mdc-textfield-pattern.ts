import { IMdcTextFieldElement } from "@aurelia-mdc-web/text-field/dist/types/mdc-text-field";
import { autoinject }           from 'aurelia-framework';
import { MdcTextField }         from "@aurelia-mdc-web/text-field";

@autoinject()
export class MdcTextfieldPatternCustomAttribute
{
	constructor( private element: Element ){ }

	valueChanged( newValue: string, oldValue: string )
	{
		const textfield = ( this.element as IMdcTextFieldElement ).au.controller.viewModel;
		const input     = textfield.input_;

		if( input )
		{
			input.setAttribute( 'pattern', newValue );

			return
		}

		const intervalId = setInterval( () =>
		{
			const input = textfield.input_;

			if( !input ) return

			clearInterval( intervalId )

			input.setAttribute( 'pattern', newValue );

		}, 50 )
	}
}
