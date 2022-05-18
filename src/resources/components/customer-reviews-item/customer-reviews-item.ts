import { bindable } from "aurelia-framework";

export class CustomerReviewsItem {

	@bindable user;
	@bindable avatar;
	@bindable created;
	@bindable rating;

}
