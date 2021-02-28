import mongoose from "mongoose";
import { Expiration } from "../../constants/expiration";
import { Device, DeviceAttrs } from "../Device";
import { File } from "../File";

export interface UserAttrs {
  name: string;
  username: string;
  roomId: string;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  username: string;
  roomId: string;
  expirationType: Expiration;
  devices: { socketId: string; device: DeviceAttrs }[];
  files: File[];
  filterDevices(
    props: DeviceAttrs & { prevId: string }
  ): { devices: Device[]; id: string };
  removeFile(id: string): void;
  filterFiles(): void;
  addFile(file: {
    mimetype: string;
    size: number;
    filename: string;
  }): { expiration: Date; id: string };
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export const UserSchema = new mongoose.Schema<UserDoc>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  expirationType: {
    type: Number,
    default: Expiration.standard,
  },
  devices: [
    {
      socketId: String,
      device: {
        name: { type: String, required: false },
        type: {
          type: String,
          required: true,
          enum: ["ios", "android", "windows", "macos", "web"],
        },
        os: {
          type: String,
          required: true,
        },
        version: {
          type: String,
          required: true,
        },
        pushToken: String,
      },
    },
  ],
  files: [
    {
      filename: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      expiration: {
        type: Date,
        required: true,
      },
    },
  ],
});

require("./methods");
require("./static");

export const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);