import { bindable } from "aurelia-framework";

export class ShopProgressTrackerStep
{
	@bindable title;
	@bindable markerText;
	@bindable route = "#";
	@bindable complete = false;
	@bindable active   = false;

}
