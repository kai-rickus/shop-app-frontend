import { MdcCheckbox }      from "@aurelia-mdc-web/checkbox";
import { MdcTextField }     from "@aurelia-mdc-web/text-field";
import { ok }               from "assert";
import { autoinject }       from "aurelia-framework";
import { Redirect, Router } from "aurelia-router";
import { TaskQueue }        from "aurelia-task-queue";
import { Debugger }         from "inspector";
import environment          from "../../environment";
import { AddressField }     from "../../resources/components/address-field/address-field";
import { ShopUser }         from "../../services/shop-user";

interface Inputs
{
	firstname: MdcTextField;
	lastname: MdcTextField;
	email: MdcTextField;
	password: MdcTextField;
	passwordConfirm: MdcTextField;
	address: AddressField;
	conditions: MdcCheckbox;
}

@autoinject
export class RegisterView
{
	formInput              = {
		firstname  : "",
		lastname   : "",
		email      : "",
		password   : "",
		language   : navigator.language,
		placeId    : "",
		newsletter : false

	};
	inputs: Inputs         = {
		firstname       : null,
		lastname        : null,
		email           : null,
		password        : null,
		passwordConfirm : null,
		address         : null,
		conditions      : null
	};
	submitting             = false;
	conditionsAccepted     = null;
	passwordRules          = {
		minlength : 10,
		maxlength : 50
	};
	emailRegex             = ".*"
	passwordRegex          = `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${this.passwordRules.minlength},${this.passwordRules.maxlength}}$`;
	showEmailUsedErrorText = false;
	unknownErrorDialog;

	constructor( public router: Router, public user: ShopUser, public taskQueue: TaskQueue ){}

	canActivate()
	{
		if( this.user.refreshToken )
		{
			return new Redirect( '/home-view' )
		}
	}

	validateConditions()
	{
		if( this.conditionsAccepted === null ) this.conditionsAccepted = false
	}

	validate()
	{
		// @ts-ignore
		if( !this.inputs.firstname.valid ) this.inputs.firstname.foundation.styleValidity()
		// @ts-ignore
		if( !this.inputs.lastname.valid ) this.inputs.lastname.foundation.styleValidity()
		// @ts-ignore
		if( !this.inputs.email.valid ) this.inputs.email.foundation.styleValidity()
		// @ts-ignore
		if( !this.inputs.password.valid ) this.inputs.password.foundation.styleValidity()
		// @ts-ignore
		if( !this.inputs.passwordConfirm.valid ) this.inputs.passwordConfirm.foundation.styleValidity()

		if( !this.inputs.address.valid ) this.inputs.address.validate()

		this.validateConditions()
	}

	checkValidityOfAllInputs(): boolean
	{
		if( !this.inputs.firstname.valid ) return false;
		if( !this.inputs.lastname.valid ) return false;
		if( !this.inputs.email.valid ) return false;
		if( !this.inputs.password.valid ) return false;
		if( !this.inputs.passwordConfirm.valid ) return false;
		if( !this.inputs.address.valid ) return false;
		if( !this.conditionsAccepted ) return false;

		return true;
	}

	isValid()
	{
		this.validate();

		const valid = this.checkValidityOfAllInputs();

		return valid;
	}

	async submit()
	{
		if( !this.isValid() ) return

		this.submitting = true

		try
		{
			const url      = `${environment.backendBaseUrl}authentication/register`
			const options  = {
				method  : "put",
				body    : JSON.stringify( this.formInput ),
				headers : { "Content-Type" : "application/json" },
			}
			const response = await fetch( url, options );
			const json     = await response.json();

			if( !response.ok ) throw new Error( json.error )

			this.router.navigateToRoute( "email-sent" )
		}
		catch( error )
		{
			if( error.message === "Email already in use." )
			{
				this.emailRegex = `^((?!${this.formInput.email}).)*$`

				this.taskQueue.queueTask( () =>
				{
					// @ts-ignore
					this.inputs.email.foundation.styleValidity()

					this.showEmailUsedErrorText = this.inputs.email.input_.validity.patternMismatch
				} )
			}
			else
			{
				this.unknownErrorDialog.open()
			}
		}

		this.submitting = false
	}
}
