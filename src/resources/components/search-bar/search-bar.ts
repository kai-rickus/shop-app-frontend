import environment    from "../../../environment";
import { autoinject } from "aurelia-framework";
import { TaskQueue }  from "aurelia-task-queue";

@autoinject()
export class SearchBar
{
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

	async getSuggestions()
	{
		this.taskQueue.queueTask( async () =>
		{

			const response = await fetch( `${environment.searchBaseUrl}search/suggest?query=${this.inputValue}`, );
			const data     = await response.json()

			this.suggestions = data.result

		} )
	}

	dispatchEvent( string )
	{
		const event = new CustomEvent( 'found', {
			detail : {
				string : string
			}
		} );

		this.element.dispatchEvent( event );
		this.clearSuggestions()
		this.inputValue = string
	}

	onKeyDown( event )
	{
		if( event.code === "Enter" && document.activeElement.classList.contains( "search-bar__suggestions__item" ) )
		{
			this.dispatchEvent( document.activeElement[ "dataset" ][ "value" ] )
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

		if( relatedTarget?.classList.contains( "search-bar__suggestions__item" ) ) return

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
}

