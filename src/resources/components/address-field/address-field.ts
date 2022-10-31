import environment              from "../../../environment";
import { autoinject, bindable } from "aurelia-framework";
import { TaskQueue }            from "aurelia-task-queue";

interface SuggestionDataset
{
	placeId: string;
}

@autoinject()
export class AddressField
{
	static AURELIA_HIDE_CLASS             = "aurelia-hide"
	static SUGGESTIONS_ELEMENT_BOTTOM_GAP = 10

	THROTTLE_DURATION = 250;

	@bindable label       = "";
	@bindable placeholder = "";
	@bindable required    = false;
	@bindable suggestion: string;
	@bindable placeId: string;
	@bindable valid: boolean;
	@bindable url: string;

	input;
	inputValue;
	suggestions      = [];
	selectionCounter = -1
	element;
	taskQueue;
	suggestionsElement: HTMLUListElement;

	constructor( taskQueue: TaskQueue )
	{
		this.taskQueue = taskQueue
	}

	clearSuggestions()
	{
		this.suggestions = []
	}

	dispatchEvent( suggestionText: string, placeId: string )
	{
		const event = new CustomEvent( 'found', {
			detail : {
				string : suggestionText,
			}
		} );
		this.element.dispatchEvent( event );
		this.clearSuggestions()
		this.inputValue = suggestionText
		this.placeId    = placeId
	}

	onKeyDown( event )
	{
		if( event.code === "Enter" && document.activeElement.classList.contains( "address-field__suggestions__item" ) )
		{
			this.dispatchEvent( document.activeElement.textContent, ( ( document.activeElement as HTMLElement ).dataset as unknown as SuggestionDataset ).placeId )
		}
		else if( event.code === "Escape" )
		{
			event.stopPropagation()
			event.preventDefault()
			this.clearSuggestions()
		}
		else if( event.code === "ArrowUp" )
		{
			event.stopPropagation()
			event.preventDefault()

			if( this.selectionCounter > -1 )
			{
				this.selectionCounter--
			}
		}
		else if( event.code === "ArrowDown" )
		{
			event.stopPropagation()
			event.preventDefault()

			if( this.selectionCounter < this.suggestions.length - 1 )
			{
				this.selectionCounter++
			}
			else if( this.suggestions.length === 0 && this.inputValue !== "" )
			{
				this.getSuggestions()
			}
		}

		return true
	}

	onFocusOut( event: FocusEvent )
	{
		const relatedTarget = event.relatedTarget as HTMLElement

		if( relatedTarget?.classList.contains( "address-field__suggestions__item" ) ) return

		this.taskQueue.queueMicroTask( () =>
		{
			const focused      = document.activeElement;
			const directParent = focused?.parentElement
			const grandParent  = focused?.parentElement?.parentElement

			if( directParent !== this.element && grandParent !== this.element )
			{
				this.clearSuggestions()
			}
		} )
	}

	async getSuggestions()
	{
		if( !this.inputValue )
		{
			this.suggestions = []

			return
		}

		this.taskQueue.queueTask( async () =>
		{
			const response = await fetch( `${environment.backendBaseUrl}locations/suggestions/${this.inputValue}/de`, );
			const data     = await response.json()

			/* TODO: error handling */

			this.suggestions = data.suggestions

			this.taskQueue.queueTask( async () => this.handleTooMuchHeight() )

			this.handleTooMuchHeight()
		} )
	}

	setHeight()
	{
		const viewport      = document.documentElement.clientHeight
		const { height, y } = this.suggestionsElement.getBoundingClientRect()
		const isToLarge     = viewport < ( y + height + AddressField.SUGGESTIONS_ELEMENT_BOTTOM_GAP )

		if( isToLarge )
		{
			const newHeight = `${viewport - y - AddressField.SUGGESTIONS_ELEMENT_BOTTOM_GAP}px`

			this.suggestionsElement.style.setProperty( "height", newHeight )
		}
	}

	handleTooMuchHeight()
	{
		const { display } = getComputedStyle( this.suggestionsElement )

		if( display !== "none" ) return this.setHeight()

		const observer = new MutationObserver( () =>
		{
			if( this.suggestionsElement.classList.contains( AddressField.AURELIA_HIDE_CLASS ) ) return

			this.setHeight()

			observer.disconnect()
		} );

		observer.observe( this.suggestionsElement, {
			attributes      : true,
			attributeFilter : [ 'class' ]
		} );
	}

	validate()
	{
		// @ts-ignore
		this.input.foundation.styleValidity()

		return this.input.valid
	}
}

/* TODO: error handling */

