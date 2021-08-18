import fs from "fs-extra";
import path from "path";
import * as Voice from "@discordjs/voice";
import Discord from "discord.js";

import { DATA_BASE } from "../../../config";
import { SoundboardStandardSampleSchema } from "../../../modules/database/schemas/SoundboardStandardSampleSchema";
import { EmbedType } from "../../../util/util";

const BASE = path.join(DATA_BASE, "soundboard");
fs.mkdirpSync(BASE);

export interface ToEmbedOptions {
    show_timestamps?: boolean;
    show_import?: boolean;
    show_delete?: boolean;
    description?: string;
    type?: EmbedType;
}

export abstract class AbstractSample implements SoundboardStandardSampleSchema {
    abstract readonly importable: boolean;
    abstract readonly deletable: boolean;

    name: string;
    plays: number;
    orig_filename: string | undefined;
    created_at: Date;
    modified_at: Date;
    last_played_at: Date | undefined;

    constructor(doc: SoundboardStandardSampleSchema) {
        this.name = doc.name;
        this.plays = doc.plays;
        this.orig_filename = doc.orig_filename || undefined;
        this.created_at = doc.created_at;
        this.modified_at = doc.modified_at;
        this.last_played_at = doc.last_played_at;
    }

    abstract get file(): string;

    protected _play(audio_player: Voice.AudioPlayer): Voice.AudioResource<AbstractSample> {
        // Attempt to convert the Sound into an AudioResource
        const stream = fs.createReadStream(this.file);
        const resource = Voice.createAudioResource(stream, { metadata: this, inputType: Voice.StreamType.OggOpus });

        /*
        We will now play this to the audio player. By default, the audio player will not play until
        at least one voice connection is subscribed to it, so it is fine to attach our resource to the
        audio player this early.
        */
        audio_player.play(resource);

        return resource;
    }

    abstract play(audio_player: Voice.AudioPlayer): Promise<Voice.AudioResource<AbstractSample>>;

    abstract toEmbed(opts: ToEmbedOptions): Discord.InteractionReplyOptions;

    static BASE = BASE;
    static EXT = ".ogg";
}
