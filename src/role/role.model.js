import { Schema, model } from 'mongoose';

const RoleSchema = new Schema({
    role: { type: String, required: true } 
});

export default model('Role', RoleSchema);