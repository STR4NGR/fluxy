const express = require('express');
const Shift = require('../models/Shift');
const Config = require('../models/Config');
const auth = require('../middleware/auth');
const router = express.Router();


// Создание смены
router.post('/', auth, async (req, res) => {
    const { storeID, date, startTime, endTime, hours } = req.body;
    const dayOff = hours === 0;

    const shift = new Shift({
        userID: req.user._id,
        storeID,
        date,
        startTime,
        endTime,
        hours,
        dayOff
    });

    await shift.save();
    res.status(201).send('Shift created');
});

// Изменение смены
router.put('/:id', auth, async(req, res) => {
    try {
        const shiftID = req.params.id;
        const shift = await Shift.findById(shiftID);
        const config = Config.findOne();

        if (!shiftID) { 
            return res.status(404).send('Shift not found');
        }

        if (!config) {
            return res.status(404).send('Config not found');
        }

        if (req.user.role !== 'admin') {
            const currentDate = new Date();
            const shiftDate = new Date(shift.date);

            if (shiftDate > currentDate) {
                return res.status(403).send('You cannot modify shift from previous days');
            }

            if (currentDate.getHours() > config.shiftModificationHour) {
                return res.status(403).send('You cannot modify shift after ' + config.shiftModificationHour);
            }
        }

        Object.assign(shift, req.body);
        await shift.save();
        res.send('Shift updated');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }

})

// Получение смен для продавца
router.get('/', auth, async (req, res) => {
    const shifts = await Shift.find({ userID: req.user._id });
    res.json(shifts);
})

module.exports = router;