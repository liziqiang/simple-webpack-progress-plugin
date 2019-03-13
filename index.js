/**
 * Created by lizq on 2017/8/6
 */
const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');

function SimpleWebpackProgressPlugin(opt) {
    let startTime;
    let running = false;
    let lastStage = '';
    let defaults = Object.assign(
        { text: 'start building...', delay: 0 },
        opt || {}
    );
    let spinner;

    // reset variables
    function _reset() {
        running = false;
        lastStage = '';
    }

    // output stage message
    function logStage(stage) {
        if (!spinner) {
            spinner = ora({
                color: 'green',
                text: chalk.green(defaults.text)
            }).info();
        }
        if (!stage || (lastStage && lastStage !== stage)) {
            spinner.succeed(chalk.grey(lastStage));
        }
        if (stage) {
            spinner.start(stage);
        }
    }

    return new webpack.ProgressPlugin((percentage, stage) => {
        if (!running) {
            startTime = +new Date();
            running = true;
        }
        if (+new Date() - startTime < defaults.delay) {
            return;
        }
        if (percentage < 1) {
            logStage(stage);
            // save stage
            lastStage = stage;
        } else {
            // output the last stage
            logStage(percentage);
            // output overall build time
            let time = (+new Date() - startTime) / 1000;
            let info = chalk.green(`done in ${chalk.yellow(time)} seconds.`);
            spinner.info(info);
            _reset();
        }
    });
}

module.exports = SimpleWebpackProgressPlugin;
