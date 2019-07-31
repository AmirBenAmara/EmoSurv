import * as mongoose from 'mongoose';

export const SettingsSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: false,
    },
    verifCode: {
        type: String,
        required: false,
    },
});