const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
    serverUrl: process.env.SONAR_SERVER || 'http://localhost:9000',
    token: process.env.SONAR_TOKEN || 'sqp_d49a610a2c18bc1045718f5aba3c348047dcf4a9',
    options: {}
}, () => process.exit());