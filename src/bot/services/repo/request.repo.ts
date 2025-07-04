import { DateTime } from "luxon";
import { IRequest } from "./schemas/interfaces";
import requestModel from "./schemas/request.schema";

class RequestRepo {
  async create(request: IRequest): Promise<IRequest> {
    const newRequest = new requestModel(request);

    return newRequest.save();
  }

  async getById(requestId: string): Promise<IRequest | null> {
    return requestModel.findOne({ requestId }).lean();
  }

  async removeOldRequest(sentBefore: DateTime) {
    return await requestModel.deleteMany({
      date: { $lt: sentBefore.toJSDate() },
    });
  }
}

export default new RequestRepo();
