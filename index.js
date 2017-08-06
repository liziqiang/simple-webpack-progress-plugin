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

    // 重置变量
    function _reset() {
        running   = false;
        lastStage = '';
    }

    // 输出已经完成的上一个阶段
    function logLast() {
        spinner.succeed( chalk.grey( lastStage ) );
    }

    return new webpack.ProgressPlugin( ( percentage, stage ) => {
        if ( !running ) {
            startTime = new Date();
            running   = true;
        }
        if ( percentage < 1 ) {
            // 已完成的阶段
            if ( lastStage && lastStage !== stage ) {
                logLast();
            }
            // 正在进行中的阶段
            spinner.start( stage );
            // 把正在进行中的阶段(栈中不存在的)入栈
            if ( !lastStage || lastStage !== stage ) {
                lastStage = stage;
            }
        } else {
            // 把最后阶段输出成完成
            logLast();
            // 输出整个build的耗时
            let time = (new Date() - startTime) / 1000;
            let info = chalk.green( `done in ${ time } seconds.` );
            spinner.info( info );
            // 重置build参数
            _reset();
        }
    } );
}

module.exports = SimpleWebpackProgressPlugin;