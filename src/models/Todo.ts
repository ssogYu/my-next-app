import mongoose, { Document, Schema } from 'mongoose';

export interface ITodoCategory extends Document {
  userId: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodo extends Document {
  userId: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  categoryId: string;
  priority: 'high' | 'medium' | 'low';
  parentId?: string;
  notes?: string;
  dueDate?: Date;
  updatedAt: Date;
}

const TodoCategorySchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    required: [true, 'Category color is required'],
    enum: ['rose', 'pink', 'purple', 'blue', 'orange', 'green', 'gray', 'indigo'],
    default: 'gray',
  },
  icon: {
    type: String,
    required: [true, 'Category icon is required'],
    maxlength: [10, 'Category icon cannot exceed 10 characters'],
    default: '📦',
  },
  order: {
    type: Number,
    required: [true, 'Category order is required'],
    min: 1,
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

TodoCategorySchema.index({ userId: 1, order: 1 });

const TodoSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  text: {
    type: String,
    required: [true, 'Todo text is required'],
    trim: true,
    maxlength: [500, 'Todo text cannot exceed 500 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  categoryId: {
    type: String,
    required: [true, 'Category ID is required'],
    ref: 'TodoCategory',
    index: true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  parentId: {
    type: String,
    default: null,
    index: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Todo notes cannot exceed 1000 characters'],
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= new Date();
      },
      message: 'Due date must be in the future',
    },
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

TodoSchema.index({ userId: 1, completed: 1 });
TodoSchema.index({ userId: 1, categoryId: 1 });
TodoSchema.index({ userId: 1, parentId: 1 });
TodoSchema.index({ userId: 1, priority: 1 });
TodoSchema.index({ userId: 1, dueDate: 1 });

const TodoCategory = mongoose.models.TodoCategory || mongoose.model<ITodoCategory>('TodoCategory', TodoCategorySchema);
const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export { TodoCategory, Todo };