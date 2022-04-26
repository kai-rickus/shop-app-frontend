import { autoinject } from 'aurelia-framework';

@autoinject()
export class CustomFocusCustomAttribute
{
	element;

	constructor( element: Element )
	{
		this.element = element
	}

	valueChanged( newValue )
	{
		if( newValue )
		{
			this.element.focus()
		}
	}
}
