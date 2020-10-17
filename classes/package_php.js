const PackageFile = require('./package_default');
 
class PackageFilePhp extends PackageFile{
    constructor () {
        super('PackageFilePhp')
        this.packageFileName = "composer.json";
    }

    getPackageFile(repository_link) {

        var file_path = repository_link.split(".com")[1] +  "/master/" + this.packageFileName;
        
        console.log("filepath: " + file_path);

        var http = require('https');
        var options = {
            host: 'raw.githubusercontent.com',
            path: file_path,
            port: 443,
            method: 'GET',
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };

        var req = http.get(options, function (versionFile) {
            var bodyChunks = [];
            versionFile.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                var body = Buffer.concat(bodyChunks);
                this.packageObject = JSON.parse(body);
                return this.packageObject.require;
            });

        });
    }
}
 
module.exports = PackageFilePhp;