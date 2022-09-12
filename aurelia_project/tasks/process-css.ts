import { CLIOptions, build }    from 'aurelia-cli';
import * as gulp                from 'gulp';
import { Options }              from "sass-embedded/dist/types/options";
import { LegacyOptions }        from "sass-embedded/dist/types/legacy/options";
import * as project             from '../aurelia.json';
import * as sass                from 'gulp-dart-sass';
import * as sassPackageImporter from 'node-sass-package-importer';
import * as postcss             from 'gulp-postcss';
import * as autoprefixer        from 'autoprefixer';
import * as cssnano             from 'cssnano';
import * as postcssUrl          from 'postcss-url';

const path       = require( 'path' )
const fs         = require( 'fs' );
const duration   = require( 'gulp-duration' )
const sourcemaps = require( 'gulp-sourcemaps' );

export default function processCSS()
{
	const env    = CLIOptions.getEnvironment();
	let pipeline = gulp
		.src( project.cssProcessor.source )
		.pipe( sourcemaps.init() )
		.pipe(
			// sassPackageImporter handles @import "~bootstrap"
			// https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer
			CLIOptions.hasFlag( 'watch' ) ?
				sass.sync( {
					quietDeps    : true,
					includePaths : [
						path.join( __dirname, '..', '..', 'node_modules' ),
						"node_modules",
					],
					importer     : sassPackageImporter(),

				} as LegacyOptions<"sync"> ).on( 'error', sass.logError ) :
				sass.sync( {
					quietDeps    : true,
					includePaths : [
						path.join( __dirname, '..', '..', 'node_modules' ),
						"node_modules",
					],
					importer     : sassPackageImporter(),
				} as LegacyOptions<"sync"> )
		)

	if( env !== 'dev' )
	{
		pipeline = pipeline
			.pipe( postcss( [
				autoprefixer(),
				// Inline images and fonts
				postcssUrl( { url : 'inline', encodeType : 'base64' } ),
				cssnano()
			] ) )
	}
	else
	{
		pipeline = pipeline
			.pipe( postcss( [
				postcssUrl( { url : 'inline', encodeType : 'base64' } ),
			] ) )
	}

	pipeline = pipeline
		.pipe( sourcemaps.write() )
		.pipe( duration( '[processCSS] time passed' ) )
		.pipe( build.bundle() );

	return pipeline
}

