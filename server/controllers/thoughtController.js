const Thought = require('../models/Thought');

// @desc    Get today's thought
// @route   GET /api/thoughts/today
// @access  Public
const getTodayThought = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let thought = await Thought.findOne({
            date: { $gte: today },
            isActive: true,
        }).sort({ date: -1 });

        // If no thought for today, get a random one
        if (!thought) {
            const count = await Thought.countDocuments({ isActive: true });
            const random = Math.floor(Math.random() * count);
            thought = await Thought.findOne({ isActive: true }).skip(random);

            // If still no thought, create a default one
            if (!thought) {
                thought = await Thought.create({
                    text: 'Cooking is love made visible.',
                    author: 'Anonymous',
                });
            }
        }

        res.status(200).json(thought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all thoughts
// @route   GET /api/thoughts
// @access  Public
const getThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ date: -1 });
        res.status(200).json(thoughts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new thought
// @route   POST /api/thoughts
// @access  Private (admin only - you may want to add admin middleware)
const createThought = async (req, res) => {
    try {
        const { text, author } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Please add thought text' });
        }

        const thought = await Thought.create({
            text,
            author: author || 'Anonymous',
        });

        res.status(201).json(thought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update thought
// @route   PUT /api/thoughts/:id
// @access  Private (admin only)
const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedThought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete thought
// @route   DELETE /api/thoughts/:id
// @access  Private (admin only)
const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        await thought.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTodayThought,
    getThoughts,
    createThought,
    updateThought,
    deleteThought,
};
