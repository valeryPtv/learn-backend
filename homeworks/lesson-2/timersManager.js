class TimersManager {
    constructor() {
        this.timers = [];
        this._areTimersStarted = false;
        this._logs = [];
    }

    _validateTimerInput(timerInput) {
        const { name, delay, interval, job } = {} = timerInput;
        const errors = [];
        if ((typeof name !== 'string' && typeof name !== 'number') || name === '') {
            errors.push(new Error('name must be provided as non empty string or number'));
        }
        if (typeof delay !== 'number' || delay < 0 || delay > 5000) {
            errors.push(new Error('delay must be provided as non negative integer, smaller than 5000'));
        }
        if (typeof interval !== 'boolean') {
            errors.push(new Error('interval must be provided as boolean'));
        }
        if (typeof job !== 'function') {
            errors.push(new Error('job must be provided as function'));
        }
        if (this.timers.some((existingTimer) => existingTimer.name === timerInput.name)) {
            errors.push(new Error('Timer name should be unique'));
        }
        if (this._areTimersStarted) {
            errors.push(new Error('Can`t add new timer when timers are started'));
        }
        if (errors.length) {
            throw new Error(`Validation error:\n${errors.join('\n')}`);
        }

        return true;
    }

    _handleCallbackWithLogging(callback, timer) {
        const log = {
            name: timer.name,
            in: timer._args,
            out: null
        };
        try {
            log.out = callback();
        } catch (error) {
            const { name, message, stack } = error;
            log.error = { name, message, stack };
        } finally {
            log.created = new Date();
            this._logs.push(log);
        }
    }

    _findTimerByName (timerName) {
        const timerFound = this.timers.find((timerInCollection) => timerInCollection.name === timerName);
        if (!timerFound) {
            throw new Error(`There is no ${timerName} timer in timers collection`);
        }

        return timerFound;
    }

    _startSpecificTimer(timerObj) {
        const newTimer = { ...timerObj };
        if (newTimer.interval) {
            const timerIntervalHandler = () => {
                if (newTimer._timer) {
                    clearTimeout(newTimer._timer);
                    this._handleCallbackWithLogging(newTimer.job, newTimer);
                }
                newTimer._timer = setTimeout(timerIntervalHandler, newTimer.delay);
            };
            timerIntervalHandler();
        } else {
            const timerHandler = () => {
                this._handleCallbackWithLogging(newTimer.job, newTimer);
            }
            newTimer._timer = setTimeout(timerHandler, newTimer.delay);
        }
        return newTimer;
    }

    _setTimersLifeTimeout() {
        const longestTimerDelay = this.timers.reduce((longestDelay, timer) => {
            return timer.delay > longestDelay ? timer.delay : longestDelay
        } , 0);

        console.log({ longestTimerDelay });
        setTimeout(() => {
            this.stop();
        }, longestTimerDelay + 3000);
    }

    add(timer, ...args) {
        const timerWithMeta = {
            ...timer,
            _timer: null,
            _args: args
        };
        if (args.length) {
            timerWithMeta.job = timerWithMeta.job.bind(timerWithMeta, ...args);
        }
        this._validateTimerInput(timer);
        this.timers = this.timers.concat(timerWithMeta);

        return this;
    }

    remove(timerName) {
        const timerFound = this._findTimerByName(timerName);
        if (timerFound) {
            clearTimeout(timerFound._timer);
            this.timers = this.timers.filter((timer) => timer !== timerFound);
            // clearTimeout(this.timers[timerIndex]._timer);
            // this.timers = this.timers.slice().splice(timerIndex, 1);
            // this.timers.splice(timerIndex, 1);
        }
    }

    start() {
        this.timers = this.timers.map((timer) => this._startSpecificTimer(timer));
        this._areTimersStarted = true;
        this._setTimersLifeTimeout();
        // this.timers.forEach((timer) => this._startSpecificTimer(timer));
    }

    stop() {
        this.timers.forEach(({ _timer }) => void clearTimeout(_timer));
    }

    pause(timerName) {
        // const timerFound = this.timers.find((timerInCollection) => timerInCollection.name === timerName);
        const timerFound = this._findTimerByName(timerName);
        if (timerFound) {
            this.timers.forEach((timerInCollection) => {
                if(timerInCollection.name === timerName) {
                    clearTimeout(timerInCollection._timer);
                }
            })
        }
    }

    resume(timerName) {
        const timerFound = this._findTimerByName(timerName);
        if (timerFound) {
            this.timers = this.timers.map((timer) => timer.name === timerName ? this._startSpecificTimer(timer) : timer);
        }
    }

    printLogs() {
        return this._logs;
    }
}

const f = () => void 0;

const manager = new TimersManager();
const t1 = {
    name: 't1',
    delay: 500,
    interval: false,
    job: () => {
        console.log('t1 hi')
    }
};
const t2 = {
    name: 't2',
    delay: 700,
    interval: false,
    job: (a, b) => {
        console.log(a + b);

        return a + b;
    }
};
const t3 = {
    name: 't3',
    delay: 1200,
    interval: true,
    job: (a, b) => {
        console.log(a * b);
        return a * b;
    }
};
manager.add(t1);
manager.add(t2, 1, 2);
manager.add(t3, 4, 4);
manager.start();
// console.log(1);
// manager.pause('t1');
// manager.resume('t1');
// setTimeout(() => manager.pause('t3'), 6000);
// const timer = setTimeout(() => console.log(manager.printLogs()), 5000);

// const timer = setTimeout(() => console.log(timer), 5000)
// console.log(timer);