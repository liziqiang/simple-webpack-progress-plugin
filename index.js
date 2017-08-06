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

    // output stage message
    function logStage( stage ) {
        let isLast = lastStage && lastStage !== stage;
        if ( !stage || isLast ) {
            spinner.succeed( chalk.grey( lastStage ) );
        }
        if ( stage && lastStage !== stage ) {
            spinner.start( stage );
        }
    }

    return new webpack.ProgressPlugin( ( percentage, stage ) => {
        if ( !running ) {
            startTime = new Date();
            running   = true;
        }
        if ( percentage < 1 ) {
            logStage( stage );
            // save stage
            lastStage = stage;
        } else {
            // output the last stage
            logStage();
            // output overall build time
            let time = (new Date() - startTime) / 1000;
            let info = chalk.green( `done in ${ time } seconds.` );
            spinner.info( info );
            _reset();
        }
    } );
}

module.exports = SimpleWebpackProgressPlugin;