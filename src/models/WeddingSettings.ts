import mongoose, { Document, Schema } from 'mongoose';

export interface IWeddingSettings extends Document {
  userId: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  backgroundImages: string[];
  theme: 'light' | 'dark';
  weddingQuote: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeddingSettingsSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    index: true,
  },
  brideName: {
    type: String,
    required: [true, 'Bride name is required'],
    trim: true,
    maxlength: [50, 'Bride name cannot exceed 50 characters'],
    default: '新娘',
  },
  groomName: {
    type: String,
    required: [true, 'Groom name is required'],
    trim: true,
    maxlength: [50, 'Groom name cannot exceed 50 characters'],
    default: '新郎',
  },
  weddingDate: {
    type: Date,
    required: [true, 'Wedding date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Wedding date must be in the future',
    },
  },
  backgroundImages: {
    type: [String],
    default: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1516571749851-9cf07e95ff23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    ],
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  weddingQuote: {
    type: String,
    trim: true,
    maxlength: [200, 'Wedding quote cannot exceed 200 characters'],
    default: '执子之手，与子偕老',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: Record<string, any>) {
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    transform: function(doc, ret: Record<string, any>) {
      delete ret.__v;
      return ret;
    },
  },
});

WeddingSettingsSchema.index({ userId: 1 });

const WeddingSettings = mongoose.models.WeddingSettings || mongoose.model<IWeddingSettings>('WeddingSettings', WeddingSettingsSchema);

export default WeddingSettings;