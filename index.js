const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import middleware CORS

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

// Set up CORS middleware
app.use(cors());

const rooms = {};
const savedAnswers = {};
const players = [
    {
        step: 0,
        imageUrl: "https://i.ibb.co/6HjWC87/mini-zoey.png",
        bigImage: "https://i.ibb.co/Kjzd2KD/Zoey-dialog.png",
        top: -28,
        playerName: "",
        lifes: 3,
        charName: "Zoey",
        isFinish: false,
        answers: [],
        isAvailable: true,
    },
    {
        step: 0,
        imageUrl: "https://i.ibb.co/2jYkzQG/mini-noah.png",
        bigImage: "https://i.ibb.co/YfvL8jx/Noah-dialog.png",
        top: -28,
        playerName: "",
        lifes: 3,
        charName: "Noah",
        isFinish: false,
        answers: [],
        isAvailable: true,
    },
    {
        step: 0,
        imageUrl: "https://i.ibb.co/4dQMgWt/mini-ruby.png",
        bigImage: "https://i.ibb.co/j6vLWpG/Ruby-dialog.png",
        top: -28,
        playerName: "",
        lifes: 3,
        charName: "Ruby",
        isFinish: false,
        answers: [],
        isAvailable: true,
    },
];
const layout = [
    [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [1],
        [],
        [1],
        [],
        [],
        [1],
        [],
        [1],
        [1],
        [1],
        [],
        [],
    ],
    [
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [],
        [],
        [1],
        [1],
        [1],
        [],
        [1],
        [],
        [],
    ],
    [
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [],
        [],
        [],
        [1],
        [],
        [],
    ],
    [
        [],
        [],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
    ],
    [
        [],
        [],
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [1],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [1],
        [1],
        [1],
        [1],
        [],
        [],
        [],
        [],
        [],
    ],
    [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ],
];
const generateLayout = () => {
    const newLayout = layout.map((el) =>
        el.map((dt) => {
            if (!dt.length)
                return { isPath: false, showTree: Math.random() * 5 > 4 };
            else
                return {
                    isPath: true,
                    showTree: false,
                    showMessage: Math.random() * 5 > 4,
                    // showMessage: false,
                };
        })
    );
    return newLayout;
};
const routes = [
    {
        x: 8,
        y: 2,
    },
    {
        x: 8,
        y: 1,
    },
    {
        x: 7,
        y: 1,
    },
    {
        x: 6,
        y: 1,
    },
    {
        x: 5,
        y: 1,
    },
    {
        x: 5,
        y: 2,
    },
    {
        x: 4,
        y: 2,
    },
    {
        x: 3,
        y: 2,
    },
    {
        x: 2,
        y: 2,
    },
    {
        x: 2,
        y: 3,
    },
    {
        x: 2,
        y: 4,
    },
    {
        x: 2,
        y: 5,
    },
    {
        x: 3,
        y: 5,
    },
    {
        x: 4,
        y: 5,
    },
    {
        x: 4,
        y: 6,
    },
    {
        x: 4,
        y: 7,
    },
    {
        x: 3,
        y: 7,
    },
    {
        x: 2,
        y: 7,
    },
    {
        x: 1,
        y: 7,
    },
    {
        x: 1,
        y: 8,
    },
    {
        x: 1,
        y: 9,
    },
    {
        x: 2,
        y: 9,
    },
    {
        x: 3,
        y: 9,
    },
    {
        x: 3,
        y: 10,
    },
    {
        x: 4,
        y: 10,
    },
    {
        x: 5,
        y: 10,
    },
    {
        x: 6,
        y: 10,
    },
    {
        x: 7,
        y: 10,
    },
    {
        x: 8,
        y: 10,
    },
    {
        x: 8,
        y: 9,
    },
    {
        x: 9,
        y: 9,
    },
    {
        x: 10,
        y: 9,
    },
    {
        x: 11,
        y: 9,
    },
    {
        x: 11,
        y: 10,
    },
    {
        x: 12,
        y: 10,
    },
    {
        x: 13,
        y: 10,
    },
    {
        x: 14,
        y: 10,
    },
    {
        x: 14,
        y: 9,
    },
    {
        x: 14,
        y: 8,
    },
    {
        x: 14,
        y: 7,
    },
    {
        x: 14,
        y: 6,
    },
    {
        x: 14,
        y: 5,
    },
    {
        x: 15,
        y: 5,
    },
    {
        x: 16,
        y: 5,
    },
    {
        x: 17,
        y: 5,
    },
    {
        x: 17,
        y: 4,
    },
    {
        x: 17,
        y: 3,
    },
    {
        x: 17,
        y: 2,
    },
    {
        x: 16,
        y: 2,
    },
    {
        x: 15,
        y: 2,
    },
    {
        x: 15,
        y: 3,
    },
    {
        x: 14,
        y: 3,
    },
    {
        x: 13,
        y: 3,
    },
    {
        x: 13,
        y: 2,
    },
    {
        x: 13,
        y: 1,
    },
    {
        x: 12,
        y: 1,
    },
    {
        x: 11,
        y: 1,
    },
    {
        x: 10,
        y: 1,
    },
    {
        x: 10,
        y: 2,
    },
];
const generateRoute = () => {
    const newRoutes = routes.map((el) => {
        el.showMessage = Math.random() * 5 > 3; // 4
        // el.showMessage = false;
        return el;
    });
    return newRoutes;
};

// Socket.io setup
io.on("connection", (socket) => {
    console.log("A client has connected");

    // Handle events
    socket.on("disconnect", () => {
        console.log("A client has disconnected");
    });

    // Example event
    socket.on("example_event", (data) => {
        // Broadcast to all clients
        io.emit("example_event_response", { message: "Received your data!" });
    });

    // Create room
    socket.on("create_room", (data) => {
        rooms[data.roomCode] = data;

        // Broadcast to all clients in the room
        io.to(data.roomCode).emit("update_room", data);
    });

    // Handle joining room
    socket.on("join_room", (data) => {
        socket.join(data.roomCode);
        console.log(
            `Socket ${socket.id} - ${data.username} joined room ${data.roomCode}`
        );
        const { username, roomCode, selectedChar, isAdmin } = data;
        rooms[roomCode] = { ...rooms[roomCode], roomCode };
        if (!rooms[roomCode].players || data.waitingRoom) {
            let newPlayers = players.map((el) => {
                if (el.isAvailable) {
                    if (el.charName === selectedChar) {
                        el.playerName = username;
                        el.isAvailable = false;
                    } else {
                        el.playerName = "";
                    }
                }
                return el;
            });
            rooms[roomCode].players = newPlayers;
        }
        // Broadcast to all clients in the room
        io.to(roomCode).emit("update_room", rooms[roomCode]);
    });

    // Start Game
    socket.on("start_game_admin", (roomCode) => {
        if (rooms[roomCode]) {
            const filteredPlayers = rooms[roomCode].players.filter(
                (el) => el.playerName
            );
            rooms[roomCode] = { roomCode, players: filteredPlayers };
            const roomLayout = generateLayout();
            const roomRoute = generateRoute();
            rooms[roomCode].layout = roomLayout;
            rooms[roomCode].route = roomRoute;
            io.to(roomCode).emit("start_game");
            io.to(roomCode).emit("update_room", rooms[roomCode]);
        }
    });

    socket.on("roll_dice", (payload) => {
        if (!payload.players) payload.players = rooms[payload.roomCode].players;
        io.to(payload.roomCode).emit("rolling_dice", payload);
    });

    socket.on("update_players", (payload) => {
        payload.players[payload.currentActivePlayer].answers =
            rooms[payload.roomCode]?.players[
                payload.currentActivePlayer
            ].answers;
        rooms[payload.roomCode].players[payload.currentActivePlayer] =
            payload.players[payload.currentActivePlayer];
        rooms[payload.roomCode].activePlayer = payload.activePlayer;

        io.to(payload.roomCode).emit("update_players", payload);
    });

    socket.on("set_random_questions", (payload) => {
        if (payload.roomCode) {
            rooms[payload.roomCode].questions = payload.questions;
            io.to(payload.roomCode).emit("set_random_questions", {
                questions: payload.questions,
            });
        }
    });

    socket.on("get_random_questions", (roomCode) => {
        const questions = rooms[roomCode]?.questions;
        socket.emit("set_random_questions", { questions });
    });

    socket.on("broadcast_answer", (payload) => {
        io.to(payload.roomCode).emit("broadcast_answer", payload);
    });

    socket.on("save_winners", (payload) => {
        if (!rooms[payload.roomCode].winners) {
            rooms[payload.roomCode].winners = [];
        }
        const isFound = rooms[payload.roomCode].winners.includes(
            (el) => el.charName === payload.winner.charName
        );
        if (!isFound) {
            rooms[payload.roomCode].winners.push(payload.winner);
            io.to(payload.roomCode).emit("save_winners", payload.winner);
        }
    });

    socket.on("next_question", (payload) => {
        if (rooms[payload.roomCode].questionIdx == undefined) {
            rooms[payload.roomCode].questionIdx = 0;
        } else {
            rooms[payload.roomCode].questionIdx += 1;
        }
        io.to(payload.roomCode).emit(
            "next_question",
            rooms[payload.roomCode].questionIdx
        );
    });

    socket.on("save_answer", (payload) => {
        console.log(payload);
        let objQuestion = {
            answer: payload.answer,
            question: { ...payload.question },
        };
        let playerName = payload.player.playerName;
        if (!savedAnswers[payload.roomCode]) {
            savedAnswers[payload.roomCode] = {};
        }
        if (!savedAnswers[payload.roomCode][playerName]) {
            savedAnswers[payload.roomCode][playerName] = [];
        }

        let found = savedAnswers[payload.roomCode][playerName]?.find(
            (el) => el.question.question === objQuestion.question.question
        );

        if (!found) {
            savedAnswers[payload.roomCode][playerName].push(objQuestion);
        }
        console.log(savedAnswers[payload.roomCode]);
    });

    socket.on("get_result", (roomCode) => {
        const result = savedAnswers[roomCode];
        const winners = rooms[roomCode]?.winners;
        socket.emit("get_result", { result, winners });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
