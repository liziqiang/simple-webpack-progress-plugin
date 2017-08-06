/**
 * Created by lizq on 2017/8/6
 */
const ora     = require( 'ora' );
const chalk   = require( 'chalk' );
const webpack = require( 'webpack' );

function SimpleWebpackProgressPlugin() {
    let startTime;
    let running   = false;
    let lastStage = '';
    let spinner   = ora( { color : 'green', text : chalk.green( 'start building...' ) } ).info();

    // reset variables
    function _reset() {
        running   = false;
        lastStage = '';
    }

    // output last stage
    function logLast() {
        spinner.succeed( chalk.grey( lastStage ) );
    }

    return new webpack.ProgressPlugin( ( percentage, stage ) => {
        if ( !running ) {
            startTime = new Date();
            running   = true;
        }
        if ( percentage < 1 ) {
            // last completed stage
            if ( lastStage && lastStage !== stage ) {
                logLast();
                spinner.start( stage );
            }
            // handle first stage
            if ( !lastStage ) {
                spinner.start( stage );
            }
            // save stage
            lastStage = stage;
        } else {
            // output the last stage
            logLast();
            // output overall build time
            let time = (new Date() - startTime) / 1000;
            let info = chalk.green( `done in ${ time } seconds.` );
            spinner.info( info );
            _reset();
        }
    } );
}

module.exports = SimpleWebpackProgressPlugin;