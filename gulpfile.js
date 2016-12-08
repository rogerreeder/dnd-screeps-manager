var gulp = require('gulp')
    ,gulpTypscript = require('gulp-typescript')
    ,gulpUglify = require('gulp-uglify')
    ,gulpConcat = require('gulp-concat')
    ,gulpRename = require('gulp-rename')
    ,https = require('https')
    ,fs = require('fs')
    ,secrets = require('./secrets.js')
    ,whichSecret = 'DunknDonuts_Research'
    ,email = secrets[whichSecret].email
	,password = secrets[whichSecret].password
    ,branch = secrets[whichSecret].branch
    ,distPath = secrets[whichSecret].distPath
    ,apiPath = secrets[whichSecret].apiRoute
    ,srcPath = secrets[whichSecret].srcPath
    ,uglify = secrets[whichSecret].uglify;

console.log('   which: ' + whichSecret);
console.log('   email: ' + email);
//console.log('password: ' + password);
console.log('  branch: ' + branch);
console.log('distPath: ' + distPath);
console.log(' apiPath: ' + apiPath);
console.log(' srcPath: ' + srcPath);

gulp.task('compile', function() {
    if(uglify) {
        return gulp.src([srcPath + '**/*.ts'])
        .pipe(gulpTypscript({noImplicitAny: false, noResolve: false, removeComments: true, target: 'es5', module: 'commonjs'}))
        .pipe(gulpConcat('/main.js'))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpUglify())
        .pipe(gulp.dest(distPath));
    } else {
        return gulp.src([srcPath + '**/*.ts'])
        .pipe(gulpTypscript({noImplicitAny: false, noResolve: false, removeComments: true, target: 'es5', module: 'commonjs'}))
        .pipe(gulpConcat('/main.js'))
        .pipe(gulp.dest(distPath));
    }
});    

gulp.task('upload-code',['compile'], function () {
    var fileToUpload = distPath + '/main.js';
    if(uglify) fileToUpload = distPath + '/main.min.js';
    console.log('\t\t\tPushing ' + fileToUpload);
	var data = { branch: branch, modules: { main: fs.readFileSync( fileToUpload, {encoding: "utf8"})}};
	var req = https.request({hostname: 'screeps.com', port: 443, path: apiPath, method: 'POST', auth: email + ':' + password, headers: {'Content-Type': 'application/json; charset=utf-8'}},
        function(res) {
            console.log('RESPONSE HEADERS');
            Object.keys(res.headers).forEach(function(value, index, array) {
                console.log('\t' + value + ':\t' + array[index]); 
            });
		    console.log('RESPONSE STATUS');
		    console.log('\tCode:\t' + res.statusCode + '\n\tMessage:\t' + res.statusMessage);
	    });
	req.write(JSON.stringify(data));
	req.end();
})
gulp.task('build', ['upload-code']);