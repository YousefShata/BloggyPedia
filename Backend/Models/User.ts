import mongoose, { Schema, model, Document } from "mongoose"

interface IUser extends Document {
    email: string;
    password: string;
    saveUser(): Promise<void>;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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