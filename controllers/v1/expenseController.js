const { Op } = require('sequelize');
const Expense = require('../../models/expense');
const Category = require('../../models/Category');
const User = require('../../models/User');

// @desc Create Expense
// @route POST /v1/expenses
// @access Private
const createExpenseHandler = async (req, res) => {
    try {
        const user = req.user;
        const { amount, narration, categoryId } = req.body;
        if (typeof amount !== 'number') {
            return res.status(400).json({
                message: 'Amount must be a number',
            });
        }

        if (typeof narration !== 'string') {
            return res.status(400).json({
                message: 'Narration must be a string',
            });
        }

        if (typeof categoryId !== 'string') {
            return res.status(400).json({
                message: 'Category Id must be a string',
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        const expense = await Expense.create({
            amount,
            narration,
        });

        expense.setUser(user);
        expense.setCategory(category);

        res.status(201).json(expense);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Expenses
// @route GET /v1/expenses
// @access Private
const getExpensesHandler = async (req, res) => {
    try {
        const user = req.user;
        let { filter, startDate, endDate } = req.query;

        if (filter) {
            if (typeof filter !== 'string') {
                return res.status(400).json({
                    message: 'Filter must be a string',
                });
            }

            const category = await Category.findOne({
                where: {
                    name: filter,
                },
            });
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found',
                });
            }
            // fetch all user expenses with the specified category
            const expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    CategoryId: category.id,
                },
            });
            return res.status(200).json(expenses);
        }
        // fetch all user expenses
        const expenses = await Expense.findAll({
            where: {
                UserId: user.id,
            },
        });

        if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            // add an extra day to the end date
            endDate.setDate(endDate.getDate() + 1);

            const expenses = await Expense.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
            });

            return res.status(200).json(expenses);
        }
        // const expenses = user.getExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Expense
// @route GET /v1/expenses/:id
// @access Private
const getExpenseHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        res.status(200).json(expense);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Update Expense
// @route PUT /v1/expenses/:id
// @access Private
const updateExpenseHandler = async (req, res) => {
    try {
        const { amount, narration, categoryId } = req.body;
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        if (typeof narration !== 'string') {
            return res.status(400).json({
                message: 'Narration must be a string',
            });
        }

        if (typeof categoryId !== 'string') {
            return res.status(400).json({
                message: 'Category Id must be a string',
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        //update expense
        expense.amount = amount;
        expense.narration = narration;
        await expense.save();

        expense.setCategory(category);

        res.status(200).json(expense);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Delete Expense
// @route DELETE /v1/expenses/:id
// @access Private
const deleteExpenseHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            });
        }

        expense.destroy();
        res.status(204).json();
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Get Expense Summary
// @route GET /v1/expenses/summary
// @access Private
const getExpenseSummaryHandler = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        const user = req.user;
        let expenses = [];

        if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            // add an extra day to the end date
            endDate.setDate(endDate.getDate() + 1);

            expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    }
                },
            });
        } else {
            expenses = await Expense.findAll({
                where: {
                    UserId: user.id,
                },
            });
        }

        let total = 0;
        let average = 0;
        expenses.forEach(expense => {
            total += Number(expense.amount);
        });

        if (expenses.length > 0) {
            average = total / expenses.length;
        }

        return res.status(200).json({
            total,
            average,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createExpenseHandler,
    getExpensesHandler,
    getExpenseHandler,
    updateExpenseHandler,
    deleteExpenseHandler,
    getExpenseSummaryHandler,
};


// create expense
// get all user expenses (filter by category)
// get single expense by id
// update expense
// delete expense