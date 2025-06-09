import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    img: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    estado: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

TaskSchema.method('toJSON', function () {
    const { _id, __v, ...task } = this.toObject();
    return { id: _id, ...task };
});

export default model('Task', TaskSchema);