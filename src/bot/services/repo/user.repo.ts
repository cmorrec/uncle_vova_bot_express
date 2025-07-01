import { From } from "@types";
import { contextUserToDb, uniqBy } from "@utils";
import { IUser } from "./schemas/interfaces";
import userModel from "./schemas/user.schema";

class UserRepo {
  async create(user: IUser): Promise<IUser> {
    const newUser = new userModel(user);

    return newUser.save();
  }

  async update(user: IUser) {
    return userModel.findOneAndUpdate({ userId: user.userId }, user);
  }

  async getById(userId: string): Promise<IUser | null> {
    return userModel.findOne({ userId }).lean();
  }

  async getByIds(userIds: string[]): Promise<IUser[]> {
    return userModel.find({ userId: { $in: userIds } }).lean();
  }

  async upsertUsers(now: Date, ctxFroms: (From | undefined)[]) {
    const filtered = ctxFroms.filter((e): e is From => Boolean(e));
    const uniq = uniqBy(filtered, (e) => e.id.toString());

    await Promise.all(
      uniq.map(async (ctxFrom) => {
        const userId = ctxFrom.id.toString();

        const user = await this.getById(userId);
        if (!user) {
          await this.create(contextUserToDb(ctxFrom, now));
        } else if (
          user.firstName !== ctxFrom.first_name ||
          user.lastName !== ctxFrom.last_name ||
          user.username !== ctxFrom.username
        ) {
          user.firstName = ctxFrom.first_name;
          user.lastName = ctxFrom.last_name;
          user.username = ctxFrom.username;
          user.updatedAt = now;

          await this.update(user);
        }
      })
    );
  }
}

export default new UserRepo();
