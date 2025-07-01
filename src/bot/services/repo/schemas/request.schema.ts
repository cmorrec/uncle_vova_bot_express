import { model, Schema } from "mongoose";
import { ChatGPTRequestType, IRequest } from "./interfaces";

const RequestSchema = new Schema<IRequest>({
  completionRequest: { type: String },
  chatRequest: { type: Schema.Types.Mixed },
  response: { type: Schema.Types.Mixed },
  date: { type: Date, required: true, default: Date.now },
  type: {
    type: String,
    enum: Object.values(ChatGPTRequestType),
    required: true,
  },
  error: { type: Schema.Types.Mixed },
});

const RequestModel = model<IRequest>("Request", RequestSchema);

export default RequestModel;
