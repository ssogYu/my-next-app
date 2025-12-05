import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
}, {
  timestamps: true,
  toJSON: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: function(doc, ret: Record<string, any>) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: function(doc, ret: Record<string, any>) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

UserSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;