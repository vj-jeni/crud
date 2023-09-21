const User = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }
  
    jwt.verify(token, 'RESTFULAPIs', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token.' });
      }
      req.user = user;
      next();
    });
  };

const register = async (req, res, next) => {
    const { user_name, age, mobile, email, password } = req.body;
    const journey = req.body.journey.toUpperCase();
    try{
      if (!user_name || !age || !mobile || !email || !password || !journey) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const nameRegex = /^([A-Z][a-z]*)(\s[A-Z][a-z]*){0,2}$/;

    if (!nameRegex.test(user_name)) {
        return res.status(400).json({ message: "Invalid user name. Please provide a valid name consisting of 2 or 3 words, starting with a letter." });
    }
    if (typeof age !== 'number' || age < 0 || age > 99) {
        return res.status(400).json({ message: "Invalid age." });
    }

    if (typeof mobile !== 'number' || !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number." });
    }

    //const mailRegex = /^\S{100,}@(gmail|yahoomail|fakemail|example)\.(com|net|org|edu|gov)$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|io|co)$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const symbolRegex = /[\W_]/;
    const numberRegex = /\d/;
    
    if (
        !uppercaseRegex.test(password) ||
        !lowercaseRegex.test(password) ||
        !symbolRegex.test(password) ||
        !numberRegex.test(password) ||
        password.length < 8
    ) {
        return res.status(400).json({ message: "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 symbol, 1 number, and be at least 8 characters long" });
    }

    if(journey!== "CORPORATE" && journey!== "INSTITUTE" && journey!== "STUDENT") {
        return res.status(400).json({ error: "Invalid value for Journey. Allowed values are CORPORATE, INSTITUTE, STUDENT"});
    }
    const existingUser = await User.findOne({email} );
    if(existingUser) {
        return res.status(400).json({ message: "User already exists with email"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({user_name, age, mobile, email, password: hashedPassword, journey});
    console.log(newUser)
    newUser.save();
    res.status(201).json(newUser);
    } catch (error) {
        //console.log(error);
      res.status(500).json({ error: 'An error occurred while registering the user.' });
    }      
}

const signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      console.log(user)
      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }
  
      const token = jwt.sign({ user_name: user.user_name, email: user.email, mobile: user.mobile, journey: user.journey }, 'RESTFULAPIs');
      res.json({ token });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while signing in.' });
    }
};

const login = async(req, res) => {
    const userData = await req.user;
    res.json(userData);
};

const getAll = async (req, res, next) => {
    try {
        let query ={}
    const { journey } = req.query;
    if(journey){
      query.journey=journey
    }
    const data = await User.find();
    console.log(data)
    if (!data.length){
    return  res.status(200).send("No Data Found")
    }
   return res.status(200).send(data);
  } catch (err) {
    next(err);
    //res.status(500).json({ error: 'An error occurred while fetching user.' });
      }
};

const getByJourney = async(req, res) => {
    const {journey} = req.query
    let query = {}
    try {
      if(journey){
        const { journeyUpperCase } = journey.toUpperCase();
        if(!journeyUpperCase== "CORPORATE" || !journeyUpperCase== "INSTITUTE" || !journeyUpperCase== "STUDENT") {
          return res.status(400).json({ error: 'Invalid Value for journey. Allowed values are (CORPORATE, INSTITUTE, STUDENT)' });
      }
      query.journey = journey
      }
      const users = await User.find(query);
      if (!users.length) {
        return res.json({ message: 'No users found.' });
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};

const getById = async(req, res) => {
    const { _id } = req.query;
    let query={}
    query._id = _id
  
    try {
      const user = await User.findOne(query);
      console.log(user)
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching user.' });
    }
};

const updateById = async(req, res) => {
    const { _id } = req.query;
    let query = {}
    query._id = _id
  try {
    const { user_name, age, mobile, email } = req.body; // Update the fields based on your schema

  if(user_name){
    const nameRegex = /^([A-Z][a-z]*)(\s[A-Z][a-z]*){0,2}$/;

    if (!nameRegex.test(user_name)) {
        return res.status(400).json({ message: "Invalid user name. Please provide a valid name consisting of 2 or 3 words, starting with a letter." });
    }
  }
  if(age){
    if (typeof age !== 'number' || age < 0 || age > 99) {
        return res.status(400).json({ message: "Invalid age." });
    }
  }

  if(mobile){
    if (typeof mobile !== 'number' || !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number." });
    }
  }

  if(email){
    //const mailRegex = /^\S{100,}@(gmail|yahoomail|fakemail|example)\.(com|net|org|edu|gov)$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|io|co)$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }
  }
    // Find the user in the database and update their information
    const updatedUser = await User.findOneAndUpdate(
      query,
      { user_name, age, mobile, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    //if(!ObjectId.isValid(_id)) {
    //    return res.status(400).json({message: "Invalid User ID"})
    //}
    res.json({message: "User updated"});
  } catch (error) {
    res.status(500).json({ error: 'Invalid User ID' });
  }
};

const deleteById = async(req, res) => {
    const { _id } = req.query;
    let query = {}
    query._id = _id
  
    try {
      const user = await User.findByIdAndDelete( query );
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      //if(!ObjectId.isValid(_id)) {
       // return res.status(400).json({message: "Invalid User ID"})
      //}
      res.json({ message: 'User deleted.' });
    } catch (error) {
      res.status(500).json({ error: 'Invalid User ID' });
    }
};

module.exports = { 
    register,
    signin,
    login,
    getAll,
    getById,
    getByJourney,
    updateById,
    deleteById,
    authenticateToken
}