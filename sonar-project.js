const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
    serverUrl: process.env.SONAR_SERVER || 'http://localhost:9000',
    token: process.env.SONAR_TOKEN || 'sqp_642eb038d741c4decefdaf7689965cd1f509a81c',
    options: {}
}, () => process.exit());