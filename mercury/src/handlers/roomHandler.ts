import { wsServer } from "..";
import { User } from "../models/user/User";

export const joinRoomHandler = async () => {
  const user = await checkUser();
  if (!user) return;

  // const devices = user.filterDevices(props);
  // user.filterFiles();

  // await user.save();

  wsServer.socket.join(user.roomId);
  // wsServer.socket.to(user.roomId).emit("set-devices", devices);
  // wsServer.socket.to(user.roomId).emit("set-files", user.files);

  // cb(devices, wsServer.socket.id);
};

export const leaveRoomHandler = async (id: string) => {
  const user = await checkUser();
  if (!user) return;

  user.devices = user.devices.filter((d) => d.socketId !== id);
  await user.save();

  wsServer.socket.to(user.roomId).emit(
    "set-devices",
    user.devices.map((d) => ({ id: d.socketId, ...d.device }))
  );
};

const checkUser = async () => {
  const username = wsServer.socket.handshake.auth.username;
  if (!username) return;
  const user = await User.findOne({ username });
  if (!user) return;
  return user;
};
