import { Transform, pipeline } from 'stream';
import fs from 'fs';
import { access as accessAsync } from 'fs/promises';
import { createGzip, createGunzip, createBrotliCompress, createDeflate, createInflate } from 'zlib';
import os from 'os';

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
};

class Archiver extends Transform {
  constructor(settings) {
    super();
    this._archivationPromise = new Promise((resolve) => resolve());
    if (settings.algorithm === 'deflate') {
      this._compressFunc = createDeflate;
      this._deCompressFunc = createInflate;

      return;
    } else if (settings.algorithm === 'gzip') {
      this._compressFunc = createGzip;
      this._deCompressFunc = createGunzip;

      return;
    }

    this.emit('error', `Algorithm must be deflate or gzip, received: ${settings.algorithm}`);
  }

  archive() {
    try {
      this._archivationPromise = new Promise((resolve, reject) => {
        pipeline(
          fs.createReadStream('./storage/randomDataSimple.csv'),
          this._compressFunc(),
          fs.createWriteStream('./storage/randomDataSimpleArch.csv.gz').on('finish', () => {
            console.log('archive write finish');
            resolve();
          }),
          (error) => {
            if (error) {
              reject(error);
            }
          },
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  async unArchive() {
    try {
      await this._archivationPromise;
      console.log('unarchive start ', 'this._archivationPromise ', this._archivationPromise);
      this._archivationPromise = new Promise((resolve, reject) => {
        pipeline(
          fs.createReadStream('./storage/randomDataSimpleArch.csv.gz')
            .on('data', (data) => {
              console.log('unarchive read data ', data);
            })
            .on('error', (error) => {
              if (error) {
                console.error('UnArchive read error', error);
                reject(error);
              }
            }),
          this._deCompressFunc(),
          fs.createWriteStream('./storage/randomDataSimpleUnArch.csv').on('finish', () => {
            console.log('unArchive write finish');
            resolve();
          })
            .on('error', (error) => {
              if (error) {
                console.error('UnArchive write error', error);
                reject(error);
              }
            }),
          (error) => {
            if (error) {
              console.error('UnArchive catch error', error);
              reject(error);
            }
          },
        );
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const archiver1 = new Archiver({ algorithm: 'deflate' });
archiver1.archive();
archiver1.unArchive();

