const express = require("express");
const User = require("./users/model.js");

const server = express();

server.use(express.json());

server.post("/api/users", (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.bio) {
        res.status(400).json("Please provide name and bio for the user");
    } else {
        User.insert(newUser)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({
                    message:
                        "There was an error while saving the user to the database",
                });
            });
    }
});

server.get("/api/users", (req, res) => {
    User.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({
                message: "The users information could not be retrieved",
            });
        });
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist",
                });
            } else {
                res.status(200).json(user);
            }
        })
        .catch(() => {
            res.status(500).json({
                message: "The user information could not be retrieved",
            });
        });
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    User.remove(id)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist",
                });
            } else {
                res.status(200).json(user);
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The user could not be removed" });
        });
});

server.put("/api/users/:id", (req, res) => {
    const {id}= req.params;
    const changes = req.body;

    User.update(id, changes)
        .then((user) => {
            if (!changes.name || !changes.bio) {
                res.status(400).json({
                    message: "Please provide name and bio for the user",
                });
            } else {
                if (!user) {
                    res.status(404).json({
                        message:
                            "The user with the specified ID does not exist",
                    });
                } else {
                    res.status(200).json(user);
                }
            }
        })
        .catch(() => {
            res.status(500).json({
                message: "The user information could not be modified",
            });
        });
});

server.use("*", (req, res) => {
    res.status(404).json({ message: "Data not found" });
});

module.exports = server;
