export var ParentCommand;
(function (ParentCommand) {
    ParentCommand[ParentCommand["InitFailed"] = 0] = "InitFailed";
    ParentCommand[ParentCommand["InitCompleted"] = 1] = "InitCompleted";
    ParentCommand[ParentCommand["Completed"] = 2] = "Completed";
    ParentCommand[ParentCommand["Failed"] = 3] = "Failed";
    ParentCommand[ParentCommand["Error"] = 4] = "Error";
    ParentCommand[ParentCommand["Progress"] = 5] = "Progress";
    ParentCommand[ParentCommand["Log"] = 6] = "Log";
})(ParentCommand || (ParentCommand = {}));
//# sourceMappingURL=parent-command.js.map