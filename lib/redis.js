const redis = require("redis");

class RedisClient {
  constructor() {
    console.log("Creating Redis client");
    this.client = redis.createClient();
    this.client.connect();
  }

  async joinRoom(roomId = null) {
    if (!roomId) {
      // Try to find an open room (less than 2 players)
      const roomIds = await this.client.keys(`${ROOM_KEY}*`);

      for (let id of roomIds) {
        const room = await this.client.hGetAll(id);
        const players = JSON.parse(room.players || "[]");

        // If the room has less than 2 players, join it
        if (players.length < 2) {
          roomId = id.replace(ROOM_KEY, ""); // Extract the roomId
          break;
        }
      }

      // If no room is found, create a new one
      if (!roomId) {
        roomId = generateRoomId();
        await createRoom(roomId);
      }
    }
  }

  addUser(socket) {
    this.client.hSet("online", socket.id, socket.username);
  }

  removeUser(id) {
    this.client.hDel("positions", id);
    this.client.hDel("online", id);
  }

  async setPlayerPosition(socket, position) {
    this.client.hSet("positions", socket.id, JSON.stringify(position));
  }

  async getPlayerPosition(id) {
    let position = await this.client.hGet("positions", id);
    return JSON.parse(position);
  }

  async getPlayerPositions() {
    let positions = await this.client.hGetAll("positions");
    let result = [];

    Object.keys(positions).forEach((key) => {
      result.push({
        id: key,
        position: JSON.parse(positions[key]),
      });
    });

    return result;
  }

  async listUsers(callback) {
    let users = await this.client.hGetAll("online");
    let UsernameArray = [];

    Object.values(users).forEach((value) => {
      UsernameArray.push(value);
    });

    return UsernameArray;
  }
}

module.exports = RedisClient;
