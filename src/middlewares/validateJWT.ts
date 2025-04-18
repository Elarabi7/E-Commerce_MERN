import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

interface ExtendRequest extends Request {
    user?: any;
}

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {
        res.status(403).json({ message: 'Authorization header was not provided' });
        return
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Bearer token not found' });
        return
    }

    jwt.verify(token, '573CB6D75EE85A667E94DF4382B1E', async (err, payload) => {
        if (err) {
            res.status(403).json({ message: 'Invalid token' });
            return
        }

        if (!payload) {
            res.status(403).json({ message: 'Invalid token payload' });
            return;
        }

        const userPayload = payload as {
            email: string;
            firstName: string;
            lastName: string
        };

        const user = await userModel.findOne({ email: userPayload.email });
        req.user = user;
        next();
    });
};

export default validateJWT;