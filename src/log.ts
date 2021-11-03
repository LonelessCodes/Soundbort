import { ENVIRONMENT, EnvironmentStages } from "./config.js";

import chalk from "chalk";
import winston from "winston";
import "winston-daily-rotate-file";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
};

winston.addColors({
    error: "bold redBG white",
    warn: "yellow",
    info: "green",
    verbose: "magenta",
    debug: "white",
});

const LOGS_DIR = "logs/";
const rotate_file_opts = {
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
};

const Logger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            level: ENVIRONMENT === EnvironmentStages.PROD
                ? "warn"
                : "debug",
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.printf(info => {
                    let str = `${info.timestamp} `;
                    if (info.shard)
                        str += chalk.magenta(`[shard:${info.shard}] `);
                    if (info.label)
                        str += chalk.cyan(`[${info.label}] `);
                    return str + `${info.level}: ${info.message}`;
                }),
            ),
        }),
        new winston.transports.DailyRotateFile({
            ...rotate_file_opts,
            filename: `${LOGS_DIR}%DATE%-bot-error.log`,
            level: "error",
        }),
        new winston.transports.DailyRotateFile({
            ...rotate_file_opts,
            filename: `${LOGS_DIR}%DATE%-bot-combined.log`,
            level: "debug",
        }),
    ],
});

export default Logger;
