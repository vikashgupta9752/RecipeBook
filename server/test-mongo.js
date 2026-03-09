const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
    console.log('Starting MongoMemoryServer...');
    try {
        const mongod = await MongoMemoryServer.create();
        console.log('URI:', mongod.getUri());
        await mongod.stop();
        console.log('Stopped.');
    } catch (e) {
        console.error(e);
    }
})();
