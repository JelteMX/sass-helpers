require('shelljs/make');

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

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

const archive = createPackage('helpers');

archive.append(fs.createReadStream(`${__dirname}/_helpers.scss`), { name: '_helpers.scss' });

archive.directory('helpers/', 'helpers');

archive.finalize();
