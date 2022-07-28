import { CLIOptions, build }    from 'aurelia-cli';
import * as gulp                from 'gulp';
import * as project             from '../aurelia.json';
import * as sass                from 'gulp-dart-sass';
import * as sassPackageImporter from 'node-sass-package-importer';
import * as postcss             from 'gulp-postcss';
import * as autoprefixer        from 'autoprefixer';
import * as cssnano             from 'cssnano';
import * as postcssUrl          from 'postcss-url';

const path = require( 'path' )

const sourcemaps = require( 'gulp-sourcemaps' );

export default function processCSS()
{
	return gulp.src( project.cssProcessor.source )
			   .pipe( sourcemaps.init() )
			   .pipe(
				   // sassPackageImporter handles @import "~bootstrap"
				   // https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer
				   CLIOptions.hasFlag( 'watch' ) ?
					   sass.sync( {
						   quietDeps    : true,
						   importer     : sassPackageImporter(),
						   includePaths : [ "node_modules" ]

					   } ).on( 'error', sass.logError ) :
					   sass.sync( {
						   quietDeps    : true,
						   importer     : sassPackageImporter(),
						   includePaths : [ "node_modules" ]
					   } )
			   )
			   .pipe( postcss( [
				   autoprefixer(),
				   // Inline images and fonts
				   postcssUrl( { url : 'inline', encodeType : 'base64' } ),
				   cssnano()
			   ] ) )
			   .pipe( sourcemaps.write() )
			   .pipe( build.bundle() );
}

