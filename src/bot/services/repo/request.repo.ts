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
}

export default new RequestRepo();
