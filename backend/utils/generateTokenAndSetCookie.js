//@ts-nocheck
import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (res, userId) => {
    // Create JWT token with user ID and expiration time of 7 days
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    // Set the token in an HttpOnly cookie
    res.cookie("token", token, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time (7 days)
    });

    return token;
}
