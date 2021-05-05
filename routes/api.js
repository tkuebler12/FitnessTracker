const router = require("express").Router();
const workout = require("../models/workout");

router.post("/api/workouts", (req, res) => {
    workout.create({})
    .then((dbWorkout) => {
        res.json(dbWorkout)
    })
    .catch((error) => {
        res.json(error)
    })
})

router.put("/api/workouts/:id", ({ body, params }, res) => {
    console.log(params);
    workout.findByIdAndUpdate(
        params.id,
        {
            $push:{ exercies:body }
        },
        {
            new: true, 
            runValidators: true
        }
    )
    .then((dbWorkout) => {
        res.json(dbWorkout)
    })
    .catch((error) => {
        res.json(error)
    })
})

router.get("/api/workouts", (req, res) => {
    workout.aggregate([
        {
            $addFields: { 
                totalDuration: {
                    $sum: "$exercies.duration"
                }
            }
        }
    ])
    .then((dbWorkout) => {
        res.json(dbWorkout)
    })
    .catch((error) => {
        res.json(error)
    })
})

router.get("/api/workouts/range", (req, res) => {
    workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: "$exercies.duration"
                }
            }
        }
    ])
    .sort({ _id: -1 })
    .limit(7)
    .then((dbWorkout) => {
        res.json(dbWorkout)
    })
    .catch((error) => {
        res.json(error)
    })
})

router.delete("/api/workouts", ({body}, res) => {
    workout.findByIdAndDelete(body.id)
    .then(() => {
        res.json(true)
    })
    .catch((error) => {
        res.json(error)
    })
})

module.exports = router;