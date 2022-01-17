import { Transform, pipeline } from 'stream';
import fs from 'fs';
import { access as accessAsync } from 'fs/promises';
import { createGzip, createGunzip, createBrotliCompress } from 'zlib';
import os from 'os';

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

class Archiver extends Transform {
  constructor(options) {
    super(options);
    this._archivationPromise = new Promise();
    this._archivationPromise.resolve();
  }

  archive() {
    pipeline(
      fs.createReadStream('./storage/randomDataSimple.csv'),
      createGzip(),
      fs.createWriteStream('./storage/randomDataSimpleArch.csv.gz'),
      handleError,
    );
  }

  async unArchive() {
    try {
      await accessAsync('./storage/randomDataSimpleArch.csv.gz', fs.constants.R_OK);
      pipeline(
        fs.createReadStream('./storage/randomDataSimpleArch.csv.gz'),
        createGunzip(handleError),
        fs.createWriteStream('./storage/randomDataSimpleUnArch.csv'),
        handleError,
      );
    } catch (error) {
      console.error(error);
    }
  }
}

const archiver1 = new Archiver();
archiver1.archive();
archiver1.unArchive();
