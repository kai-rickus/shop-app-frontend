import { MdcCheckbox }  from "@aurelia-mdc-web/checkbox";
import { MdcTextField } from "@aurelia-mdc-web/text-field";
import { bindable }     from "aurelia-framework";
import { Router }       from "aurelia-router";
import { AddressField } from "resources/components/address-field/address-field";

interface Inputs
{
	firstname: MdcTextField;
	lastname: MdcTextField;
	address: AddressField;
}

export class AddAddressView
{
	inputs: Inputs         = {
		firstname       : null,
		lastname        : null,
		address         : null,
	};
}
