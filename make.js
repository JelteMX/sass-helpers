require('shelljs/make');

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const Mustache = require("mustache");
const pkg = require('./package.json');

const repository = 'https://github.com/JelteMX/sass-helpers/';

function createPackage(distname) {
    mkdir("-p", "dist");

    const output = fs.createWriteStream(path.join("dist", distname) + ".zip");
    const archive = archiver("zip", {});

    output.on("close", function() {
        console.log("Written %d bytes to %s", archive.pointer(), output.path);
    });

    output.on("error", function(err) {
        console.error("Error: %s", err.toString());
    });

    archive.pipe(output);

    return archive;
}

const config = {
    repository,
    version: pkg.version,
    url: repository + 'releases/tag/' + pkg.version
};

const archive = createPackage('helpers');
const mainFile = fs.readFileSync(`${__dirname}/_helper.scss`, { encoding: "utf8" });
const renderedFile = Mustache.render(mainFile, config);

archive.append(renderedFile, { name: '_helper.scss' });

archive.directory('helpers/', 'helpers');

archive.finalize();
