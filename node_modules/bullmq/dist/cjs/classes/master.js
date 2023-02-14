"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const child_processor_1 = require("./child-processor");
const interfaces_1 = require("../interfaces");
const utils_1 = require("../utils");
const childProcessor = new child_processor_1.ChildProcessor();
process.on('message', async (msg) => {
    try {
        switch (msg.cmd) {
            case interfaces_1.ChildCommand.Init:
                await childProcessor.init(msg.value);
                break;
            case interfaces_1.ChildCommand.Start:
                await childProcessor.start(msg.job);
                break;
            case interfaces_1.ChildCommand.Stop:
                break;
        }
    }
    catch (err) {
        console.error('Error handling child message');
    }
});
process.on('SIGTERM', () => childProcessor.waitForCurrentJobAndExit());
process.on('SIGINT', () => childProcessor.waitForCurrentJobAndExit());
process.on('uncaughtException', async (err) => {
    if (!err.message) {
        err = new Error((0, lodash_1.toString)(err));
    }
    await (0, utils_1.childSend)(process, {
        cmd: interfaces_1.ParentCommand.Failed,
        value: err,
    });
    // An uncaughException leaves this process in a potentially undetermined state so
    // we must exit
    process.exit(-1);
});
//# sourceMappingURL=master.js.map