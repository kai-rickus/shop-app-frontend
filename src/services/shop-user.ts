import { singleton } from "aurelia-framework";

@singleton()
export class ShopUser
{
	email
	public refreshToken
	public accessToken
	public firstName
	public lastName
	public avatar
}
