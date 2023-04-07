import 'bootstrap';
import { Aurelia } from 'aurelia-framework';
import environment from './environment';
import {
	usePropertyTypeForBindable,
	usePropertyTypeForObservable,
	coerceFunctions
}                  from 'aurelia-typed-observable-plugin';

( window as any ).process = {
	env : {
		NODE_ENV : environment.name
	}
}

export function configure( aurelia: Aurelia ): void
{
	aurelia.use
		   .standardConfiguration()
		   .feature( 'resources' )
		   .developmentLogging( environment.debug ? 'debug' : 'warn' )
		   .plugin( "aurelia-async-binding" )
		   .plugin( "aurelia-animator-css", config => config.useAnimationDoneClasses = true )
		   .plugin( "aurelia-typed-observable-plugin" )
		   .plugin( 'aurelia-portal-attribute' )
		   .plugin( '@aurelia-mdc-web/all' )
		   .plugin( 'aurelia-validation' )
		   .plugin( "@pitaya-components/progress-tracker" )

	typedBindablesSetup()

	if( environment.testing )
	{
		aurelia.use.plugin( 'aurelia-testing' );
	}

	//Uncomment the line below to enable animation.
	aurelia.use.plugin( 'aurelia-animator-css' );
	//if the css animator is enabled, add swap-order="after" to all router-view elements

	//Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
	// aurelia.use.plugin('aurelia-html-import-template-loader');

	aurelia.start().then( () => aurelia.setRoot() );
}

function typedBindablesSetup()
{
	// usePropertyTypeForBindable( true );
	// usePropertyTypeForObservable( true );

	coerceFunctions.boolean = value => value || value === ''
}
