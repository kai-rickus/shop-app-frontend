import { Interface }            from "readline";
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
	@bindable required = false;
	@bindable url;
	@bindable suggestion;
	@bindable placeId;

	inputValue;
	suggestions      = [];
	selectionCounter = -1
	formElement;
	element;
	taskQueue;

	constructor( taskQueue: TaskQueue )
	{
		this.taskQueue = taskQueue
	}

	clearSuggestions()
	{
		this.suggestions = []
	}

	dispatchEvent( suggestionText, placeId )
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

			if( directParent !== this.formElement && grandParent !== this.formElement )
			{
				this.clearSuggestions()
			}
		} )
	}

	async getSuggestions()
	{
		this.taskQueue.queueTask( async () =>
		{

			const response = await fetch( `${environment.backendBaseUrl}locations/suggestions/${this.inputValue}/de`, );
			const data     = await response.json()

			this.suggestions = data.suggestions
		} )
	}
}

