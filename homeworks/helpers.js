const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;

const getIsChunkStructureCorrect = (chunk, chunkSchema) => {
  const isChunkRecursivelyValid = Object.entries(chunk).every(([ key, value ]) => {
    if (isObject(value) && chunkSchema[ key ]) {
      return getIsChunkStructureCorrect(value, chunkSchema[ key ]);
    }

    const doesSchemaHaveKey = key in chunkSchema;

    return value || doesSchemaHaveKey || typeof value === typeof chunkSchema[ key ];
  });

  const doesChunkHaveAllKeys = Object.keys(chunkSchema).every((key) => key in chunk);

  return isChunkRecursivelyValid && doesChunkHaveAllKeys;
};


module.exports = {
  isObject,
  getIsChunkStructureCorrect,
};
