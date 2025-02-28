import { Queue } from "bullmq";

const waitListQueue = new Queue("carWaitList", {
    connection:{
        host: "localhost",
        port: 6379
    },
});

export {waitListQueue}