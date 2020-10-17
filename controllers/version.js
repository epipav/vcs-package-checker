exports.scheduleVersionCheck = (req, res, next) => {
    var schedule = require('node-schedule');
    const PackageFactory= require('../classes/package_factory');
    
    var rule = new schedule.RecurrenceRule();
    rule.second = 10;

    var j = schedule.scheduleJob(rule, function (req) {

        console.log("logging req..");
        console.log(req.body);
        console.log("req end....");
        var email = req.body.email;

            
        var http = require('https');
        var options = {
            host: 'raw.githubusercontent.com',
            path: req.body.repository_url.split(".com")[1] +  "/master/package.json", 
            port: 443,
            method: 'GET',
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };

        var req = http.get(options, function (versionFile) {
            console.log('STATUS: ' + versionFile.statusCode);
            console.log('HEADERS: ' + JSON.stringify(versionFile.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            versionFile.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', async function () {
                var body = Buffer.concat(bodyChunks);
                console.log('BODY: ' + body);
                // ...and/or process the entire body here.
                var packageJson = JSON.parse(body);

                console.log(packageJson.dependencies); 

                var buu = await getAllLatestVersions(packageJson.dependencies);
                console.log(buu);

                var MailConfig = require('../config/email');
                var hbs = require('nodemailer-express-handlebars');
                var gmailTransport = MailConfig.GmailTransport;
                MailConfig.ViewOption(gmailTransport, hbs);
                let HelperOptions = {
                    from: '"Version Checker" <version-checker@gmail.com>',
                    to: email,
                    subject: 'Your version checker update!',
                    template: 'test',
                    context: {
                        name: "tariqul_islam",
                        email: "tariqul.islam.rony@gmail.com",
                        address: "52, Kadamtola Shubag dhaka",
                        versions: buu
                    }
                };
                gmailTransport.sendMail(HelperOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.json(error);
                    }
                    console.log("email is send");
                    console.log(info);


                });


            })
        });

        req.on('error', function (e) {
            console.log('ERROR: ' + e.message);
        });


    }.bind(null, req));

    return res.send({ "schedule_result": j });




}

function compareVersions(version1, version2) {
    var v1_split = version1.replace(/\D/g, '').split(".");
    var v2_split = version2.replace(/\D/g, '').split(".");

    for (let a = 0; a < v1_split.length; a++) {
        if (v1_split[a] > v2_split[a]) {
            return 1;
        }
        else if (v2_split[a] > v1_split[a]) {
            return -1
        }
    }

    return 0;

}


async function getAllLatestVersions(dependencies) {
    var latestVersion = require('latest-version');

    var outOfDatePackages = [];

    for (const dependency in dependencies) {
        console.log(dependency + " is " + dependencies[dependency]);

        var lv = await latestVersion(dependency);

        console.log(lv);

        if (compareVersions(lv, dependencies[dependency]) > 0) {
            //console.log("MORE RECENT VERSION !! [" + latestVersion + "] vs [" + packageJson.dependencies[dependency] + "]");
            package_obj = {};
            package_obj.name = dependency;
            package_obj.current_version = dependencies[dependency].replace(/[^\d.-]/g, '');
            package_obj.latest_version = lv;

            //console.log(package_obj);
            outOfDatePackages.push(package_obj);

        }

        console.log(outOfDatePackages)



    }
    return outOfDatePackages;



}
