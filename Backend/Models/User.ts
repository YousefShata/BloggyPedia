import mongoose, { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  favorites: mongoose.Schema.Types.ObjectId;
  saveUser(): Promise<void>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: 'public/upload/profile-pics/download.png',
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
});

userSchema.methods.saveUser = async function () {
  try {
    await this.save();
    console.log('User saved successfully');
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
