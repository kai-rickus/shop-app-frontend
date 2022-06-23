import { singleton } from "aurelia-framework";

export interface UserOptions
{
	accessToken?: string;
	refreshToken?: string;
	lastName?: string;
	firstName?: string;
	email?: string;
	avatar: string;
}

@singleton()
export class ShopUser
{
	public email
	public refreshToken
	public accessToken
	public firstName
	public lastName
	public avatar

	set( options: UserOptions )
	{
		this.accessToken  = options.accessToken
		this.refreshToken = options.refreshToken
		this.avatar       = options.avatar
		this.lastName     = options.lastName
		this.firstName    = options.firstName
		this.email        = options.email
	}

	clear()
	{
		this.accessToken  = undefined
		this.refreshToken = undefined
		this.avatar       = undefined
		this.lastName     = undefined
		this.firstName    = undefined
		this.email        = undefined
	}
}
