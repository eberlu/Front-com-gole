const 
{src, dest, series,watch} = require('gulp')
,clean = require('gulp-clean')
,twig = require('gulp-twig')

const configs = {
    dist: 'dist',
    src: 'src',
    templates:{
        ext: '.twig'
    }
}

function Clean(){
    return src(configs.dist).pipe(clean({read:false}));
}

function Templates(){
    return new Promise((resolve,reject) => {
        src(`${configs.src}/[^_]*${configs.templates.ext}`)
        .pipe(twig())
        .pipe(dest(configs.dist))
        .on('error', reject)
        .on('end', resolve)
    })
}

exports.clean = Clean;
exports.templates = Templates;