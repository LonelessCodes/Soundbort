import Discord from "discord.js";
import qs from "query-string";

import { BUTTON_TYPES } from "../const.js";
import { TopCommand } from "../modules/commands/TopCommand.js";
import { TopCommandGroup } from "../modules/commands/TopCommandGroup.js";
import { SimpleFuncReturn } from "../modules/commands/types/index.js";

export type ButtonFilter = Record<string, string>;
export type ButtonParsed = qs.ParsedQuery<string> & { t: BUTTON_TYPES };

export type ButtonHandler = (interaction: Discord.ButtonInteraction, decoded: ButtonParsed) => (Promise<SimpleFuncReturn> | SimpleFuncReturn);

class InteractionRegistry {
    public commands: Discord.Collection<string, TopCommand | TopCommandGroup> = new Discord.Collection();
    public buttons: { filter: ButtonFilter; func: ButtonHandler }[] = [];

    public addCommand(command: TopCommand | TopCommandGroup): void {
        if (this.commands.has(command.name)) throw new Error("Command name already exists");

        this.commands.set(command.name, command);
    }

    public addButton(filter: ButtonFilter, func: ButtonHandler): void {
        this.buttons.push({
            filter,
            func,
        });
    }

    public encodeButtonId(json: ButtonParsed): string {
        return qs.stringify(json, { encode: true });
    }

    public decodeButtonId(id: string): ButtonParsed {
        return qs.parse(id, { decode: true }) as ButtonParsed;
    }

    public checkButtonFilter(json: ButtonParsed, filter: ButtonFilter): boolean {
        return Object.keys(filter).every(key => filter[key] === json[key]);
    }
}

export default new InteractionRegistry();
