
import {User} from "../Models/UserModel.js";

export async function authenticateUser(req, res, next) {
  try {
  
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ success: false, message: "No token provided" });
        }
    
        const email = authHeader.split(" ")[1]; 


    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }


    // 3️⃣ Find the user in MongoDB
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "User not found in database" });
    }

    // 4️⃣ Attach user data to request object
    req.user = existingUser;
    next(); // Move to the next middleware
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Authentication failed", error });
  }
}
