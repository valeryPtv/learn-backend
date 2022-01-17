// Core
const { Readable, Writable, Transform } = require('stream');
const fs = require('fs').promises;
const path = require('path');

// Helpers
const { isObject } = require('../helpers');

class Json2csv extends Transform {
  static async transformAndWrite (csv) {
    try {
      await fs.writeFile(path.join('./csv/', new Date().toISOString()), csv);
    } catch (error) {
      console.error(error);
    }
  }

  static _transform (collection) {
    const parsed = JSON.parse(collection);

    const csvWithoutHeaders = Object.values(parsed).reduce((accTotal, currObj) => {
      return  Object.entries(currObj).reduce((accInner, [ key, value ], index, arr) => {
        return {
          data:    `${accInner.data}${value}${index === arr.length - 1 ? '\n' : ';'}`,
          headers: accInner.headers.add(key),
        };
      }, accTotal);
    }, {
      headers: new Set(),
      data:    '',
    });

    return `${[ ...csvWithoutHeaders.headers ].join(';')}\n${csvWithoutHeaders.data}`;
  }
}


/*
class Json2csv extends Transform {
    constructor(options = {}) {
        super(options);
    }

    _transform(chunk, encoding, done) {
        const parsed = JSON.parse(chunk);
        const csv = Json2csv._transformJsonToCsv(parsed);
        this.push(csv);

        done();
    }

    static _transformJsonToCsv(collection) {
        const csvWithoutHeaders = Object.values(collection).reduce((accTotal, currObj) => {
            return  Object.entries(currObj).reduce((accInner, [ key, value ], index, arr) => {
                return {
                    data:    `${accInner.data}${value}${index === arr.length - 1 ? '\n' : ';'}`,
                    headers: accInner.headers.add(key),
                };
            }, accTotal);
        }, {
            headers: new Set(),
            data:    '',
        });

        return `${[ ...csvWithoutHeaders.headers ].join(';')}\n${csvWithoutHeaders.data}`;
    }
}

 */

const sample = [
  {
    postId: 1,
    id:     1,
    name:   'id labore ex et quam laborum',
    email:  'Eliseo@gardner.biz',
    body:   'laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium',
  },
  {
    postId: 1,
    id:     2,
    name:   'id labore ex et quam laborum',
    email:  'Jayne_Kuhic@sydney.com',
    body:   'est natus enim nihil est dolore omnis voluptatem numquam\\net omnis occaecati quod ullam at\\nvoluptatem error expedita pariatur\\nnihil sint nostrum voluptatem reiciendis et',
  },
];

const csv = Json2csv.transformAndWrite(JSON.stringify(sample));
console.log(csv);
