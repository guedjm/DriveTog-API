
module.exports = {
  database: {
    server: "localhost",
    port: 27017,
    database: "driveTog"
  },
  server: {
    vhost: false,
    port: 3001,
    url: "api.drivetog.local",
    fullUrl: "http://127.0.0.1:3001"
  },
  test: {
    client: {
      clientId: '4a593f6f67d86099264e5f00e30de8fb4c95f182',
      clientSecret: 'e2e04574198b7a031aae79cd5f48b29d20242f17'
    },
    user: {
      email: 'test@gmail.com',
      password: 'azerty',
      firstName: 'Test',
      lastName: 'Test',
      pseudo: 'Test'
    }
  }
};
