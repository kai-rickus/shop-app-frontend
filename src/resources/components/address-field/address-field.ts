import { MdcSnackbarService } from "@aurelia-mdc-web/snackbar";
import environment            from "../../../environment";
import {
	autoinject,
	bindable
}                             from "aurelia-framework";
import { TaskQueue }          from "aurelia-task-queue";
import {
	ValidationController,
	ValidationControllerFactory,
	ValidationRules,
	Rule,
	validateTrigger,
}                             from "aurelia-validation";

interface SuggestionDataset
{
	placeId: string;
}

interface Suggestion
{
	description: string;
	matched_substrings: { length: number; offset: number }[]
	place_id: string;
	reference: string;
	structured_formatting: any;
	terms: any[];
	types: string[];
}

// interface ValidationStatusMap
// {
// 	[ key: string ]: AddressValidationStatus;
// }

interface ValidationStatus
{
	valid: "valid",
	invalid: "invalid",
	undeterminated: "undeterminated"
};

@autoinject()
export class AddressField
{
	public static readonly AURELIA_HIDE_CLASS                            = "aurelia-hide"
	public static readonly SUGGESTIONS_ELEMENT_BOTTOM_GAP                = 10
	public static readonly INCOMPLETE_ADDRESS_ERROR_MESSAGE              = "Es muss eine vollständige Wohnanschrift eingetragen werden"
	public static readonly ERROR_WHILE_LOADING_SUGGESTIONS_ERROR_MESSAGE = "Vorschläge konnten nicht geladen werden"

	public readonly THROTTLE_DURATION                   = 250;
	public readonly VALIDATION_STATUS: ValidationStatus = {
		valid          : "valid",
		invalid        : "invalid",
		undeterminated : "undeterminated"
	};

	@bindable label       = "";
	@bindable placeholder = "";
	@bindable required    = false;
	@bindable suggestion: string;
	@bindable placeId: string;
	@bindable valid: boolean;
	@bindable url: string;
	@bindable disabled: boolean;

	input;
	inputValue;
	suggestions: Suggestion[] = [];
	selectionCounter          = -1
	element;
	suggestionsElement: HTMLUListElement;

	private _addressValidationStatus: ValidationStatus[keyof ValidationStatus] = "undeterminated";
	private _validationPending                                                 = false;
	private _validationController: ValidationController
	private _rules: Rule<AddressField, unknown>[][];

	constructor(
		private _taskQueue: TaskQueue,
		private snackbar: MdcSnackbarService,
		validationControllerFactory: ValidationControllerFactory,
	)
	{
		this._configureValidation( validationControllerFactory )
	}

	private attached()
	{
		this._validationController.addObject( this, this._rules );
	}

	private _configureValidation( validationControllerFactory: ValidationControllerFactory )
	{
		this._validationController                 = validationControllerFactory.createForCurrentScope();
		this._validationController.validateTrigger = validateTrigger.manual;

		this._rules = ValidationRules
			.ensure<AddressField, string>( addressfield => addressfield.inputValue )
			.satisfies( async inputValue =>
			{
				if( !inputValue )
				{
					this._addressValidationStatus = this.required ? "invalid" : "undeterminated"

					return !this.required
				}

				this._validationPending = true

				let valid = false

				try
				{
					const response = await fetch( `${environment.backendBaseUrl}locations/isComplete/${this.placeId}`, );
					const data     = await response.json()

					this._addressValidationStatus = data.addressIsComplete ? "valid" : "invalid"

					if( !data.addressIsComplete && ( this.inputValue !== data.label || this.placeId !== data.placeId ) )
					{
						this.inputValue = data.label
						this.placeId    = data.placeId
					}

					valid = data.addressIsComplete
				}
				catch
				{}

				this._validationPending = false

				return valid

			} )
			.withMessage( AddressField.INCOMPLETE_ADDRESS_ERROR_MESSAGE )
			.rules;
	}

	private _clearSuggestions()
	{
		this.suggestions = []
	}

	private _dispatchEvent( suggestionText: string, placeId: string )
	{
		const event = new CustomEvent( 'found', {
			detail : {
				string : suggestionText,
				placeId,
			}
		} );

		this.element.dispatchEvent( event );
	}

	private async _selectSuggestion( suggestionText: string, placeId: string )
	{
		this.inputValue = suggestionText.trim()
		this.placeId    = placeId.trim()

		await this.validateCompleteness()
		this._clearSuggestions()
		this._dispatchEvent( this.inputValue, this.placeId )
	}

	private _onKeyDown( event )
	{
		if( event.code === "Enter" && document.activeElement.classList.contains( "address-field__suggestions__item" ) )
		{
			this._selectSuggestion( document.activeElement.textContent, ( ( document.activeElement as HTMLElement ).dataset as unknown as SuggestionDataset ).placeId )
		}
		else if( event.code === "Escape" )
		{
			event.stopPropagation()
			event.preventDefault()
			this._clearSuggestions()
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
				this._getSuggestions()
			}
		}

		return true
	}

	private _onFocusOut( event: FocusEvent )
	{
		const relatedTarget = event.relatedTarget as HTMLElement

		if( relatedTarget?.classList.contains( "address-field__suggestions__item" ) ) return

		const focused      = document.activeElement;
		const directParent = focused?.parentElement
		const grandParent  = focused?.parentElement?.parentElement

		if( directParent === this.element || grandParent === this.element ) return

		if( this.suggestions.length )
		{
			const [ suggestion ] = this.suggestions
			const suggestionText = suggestion?.description || ''
			const placeId        = suggestion?.place_id || ''

			this._selectSuggestion( suggestionText, placeId )

			return
		}

		this.validateCompleteness()

		this._taskQueue.queueMicroTask( () => void this._clearSuggestions() )
	}

	private async _getSuggestions()
	{
		if( !this.inputValue )
		{
			this.suggestions = []

			return
		}

		this._taskQueue.queueTask( async () =>
		{
			try
			{
				const response = await fetch( `${environment.backendBaseUrl}locations/suggestions/${this.inputValue}/de` );
				const data     = await response.json()

				this.suggestions = data.suggestions

				this._taskQueue.queueTask( async () => this._handleTooMuchHeight() )

				this._handleTooMuchHeight()
			}
			catch( error )
			{
				if( this.suggestions[ 0 ]?.description === AddressField.ERROR_WHILE_LOADING_SUGGESTIONS_ERROR_MESSAGE ) return

				this.suggestions.push( {
					description           : AddressField.ERROR_WHILE_LOADING_SUGGESTIONS_ERROR_MESSAGE,
					matched_substrings    : [],
					place_id              : "",
					reference             : "",
					structured_formatting : "",
					terms                 : [],
					types                 : [],
				} )
			}
		} )
	}

	private _setHeight()
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

	private _handleTooMuchHeight()
	{
		const { display } = getComputedStyle( this.suggestionsElement )

		if( display !== "none" ) return this._setHeight()

		const observer = new MutationObserver( () =>
		{
			if( this.suggestionsElement.classList.contains( AddressField.AURELIA_HIDE_CLASS ) ) return

			this._setHeight()

			observer.disconnect()
		} );

		observer.observe( this.suggestionsElement, {
			attributes      : true,
			attributeFilter : [ 'class' ]
		} );
	}

	public validate()
	{
		// @ts-ignore
		this.input.foundation.styleValidity()

		return this.input.valid
	}

	public async validateCompleteness()
	{
		await this._validationController.validate();
	}
}

