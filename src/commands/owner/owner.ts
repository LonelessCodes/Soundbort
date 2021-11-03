import Discord from "discord.js";

import { OWNER_GUILD_IDS, OWNER_IDS } from "../../config.js";
import { isOwner } from "../../util/util.js";

import InteractionRegistry from "../../core/InteractionRegistry.js";
import { EmbedType, replyEmbedEphemeral } from "../../util/builders/embed.js";
import { TopCommandGroup } from "../../modules/commands/TopCommandGroup.js";
import { createUserPermission } from "../../modules/commands/options/createPermission.js";

// import commands. We can do this, because they don't register any commands by themselves,
// so if they're already imported by the Core it doesn't matter
import reboot_cmd from "./owner_reboot.js";
import blacklist_cmd from "./owner_blacklist.js";
import upload_standard_cmd from "./owner_upload.js";
import delete_cmd from "./owner_delete.js";
import import_cmd from "./owner_import.js";

InteractionRegistry.addCommand(new TopCommandGroup({
    name: "owner",
    description: "A set of owner commands.",
    commands: [
        blacklist_cmd,
        upload_standard_cmd,
        delete_cmd,
        import_cmd,
        reboot_cmd,
    ],
    target: {
        global: false,
        guildHidden: true,
        // this way, owner commands are only available in specific guilds
        // (since they are greyed out instead of hidden if users dont have the permissions to use them)
        guild_ids: OWNER_GUILD_IDS,
    },
    async middleware(interaction) {
        if (isOwner(interaction.user.id)) return true;

        await interaction.reply(replyEmbedEphemeral("You need to be a bot developer for that.", EmbedType.Error));
        return false;
    },
    async onGuildCreate(app_command) {
        const permissions: Discord.ApplicationCommandPermissionData[] = OWNER_IDS.map(id => createUserPermission(id, true));
        await app_command.permissions.set({ permissions });
    },
}));
