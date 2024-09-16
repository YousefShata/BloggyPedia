import mongoose, { Schema, model, Document } from "mongoose"

interface IBlog extends Document {
    title: string;
    content: string;
    userId: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    saveBlog(): Promise<void>;
}

const BlogSchema = new Schema<IBlog>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

BlogSchema.methods.saveBlog = async function () {
    try {
      await this.save();
      console.log('Blog saved successfully');
    } catch (error) {
      console.error('Error saving Blog:', error);
    }
  };

const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
  
export default Blog;