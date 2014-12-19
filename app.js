var profile = require('./profile'),
    location = process.argv.slice(2).join();

profile.get(location);