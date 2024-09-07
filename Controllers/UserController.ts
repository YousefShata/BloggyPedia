import User from "../Models/User";
import crypto from 'crypto';
import { Request, Response } from 'express';


class UserController{
    static async register(req: Request, res: Response){
        let data: any;
        if (!req.body){
            return res.status(400).json({error: 'body is empty'});
        }
        data = req.body;

        if (!data.email || typeof data.email !== 'string') {
            return res.status(400).json({ error: 'Valid email is required.' });
        }
        if (!data.password || typeof data.password !== 'string') {
            return res.status(400).json({ error: 'Valid password is required.' });
        }

        const hashedPassword = crypto.createHash('sha1').update(data.password).digest('hex');
        try{
        const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists.' });
        }

        const newUser = new User({
            email: data.email,
            password: hashedPassword,
        });
        await newUser.saveUser();
        return res.status(200).json({message: "User added Succefully"});
        }
        catch(err){
        return res.status(500).json({error: err})
        }
    }
    static async login(req: Request, res: Response){
        let data: any;
        if (!req.body){
            return res.status(400).json({error: 'body is empty'});
        }
        data = req.body;

        if (!data.email || typeof data.email !== 'string') {
            return res.status(400).json({ error: 'Valid email is required.' });
        }
        if (!data.password || typeof data.password !== 'string') {
            return res.status(400).json({ error: 'Valid password is required.' });
        }

        const hashedPassword = crypto.createHash('sha1').update(data.password).digest('hex');
        try{
        const foundUser = await User.findOne({email: data.email, password: hashedPassword});
        if (foundUser){
            return res.status(200).json({message: "User logged in"});
        }
        return res.status(404).json({error: "Invalid Email or Password"});
        }
        catch(err){
            return res.status(500).json({error: err})
        }
    }
}

export default UserController;