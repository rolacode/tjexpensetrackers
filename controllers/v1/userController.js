const bcrypt = require('bcrypt');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


// @desc Create User
// @route POST /v1/users
// @access Public
const createUserHandler = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (typeof name !== 'string') {
            return res.status(400).json({
                message: 'Name must be a string',
            });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({
                message: 'Email must be a string',
            });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({
                message: 'Password must be a string',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve User
// @route GET /v1/users/:id
// @access Public
const getUserHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Update Users
// @route PUT /v1/Users/:id
// @access Private
const updateUserHandler = async (req, res) => {
    try {
      const { id } = req.params;
      let { name, email } = req.body;
  
      if (typeof id !== 'string') {
          return res.status(400).json({
              message: 'Id must be a string',
          });
      }
  
      if (typeof name !== "string") {
        res.status(400).json({
          message: "name must be string",
        });
        return;
      }

      if (typeof email !== "string") {
        res.status(400).json({
          message: "email must be string",
        });
        return;
      } else if (!email.includes("@")) {
        res.status(400).json({
          message: "Enter vaild email",
        });
      }
  
      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        res.status(404).json({
          message: "User Not Found",
        });
        return;
      }
      user.name = name;
      user.email = email;
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "error message",
      });
    }
  };

// @desc Login User
// @route GET /v1/users/login
// @access Public
const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({
            message: 'Invalid email',
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid password',
        });
    }

    const payload = {
        id: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    res.status(200).json({
        token,
    });
};

const deleteUserHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const user = await user.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await user.destroy();
        res.status(204).json({
            message: "user Deleted successfully",
          });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    createUserHandler,
    getUserHandler,
    updateUserHandler,
    loginUserHandler,
    deleteUserHandler
}