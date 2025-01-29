import UserService from './user.service'

class LeaderboardService {

  static async getRankings() {
    try {
      const users = await UserService.getAllUsersRanking();

      return users;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default LeaderboardService