module.exports.ArrayUtils = {
  removeByIndex(array, indexes) {
    indexes.reverse().forEach((index) => array.splice(index, 1))
  }
}
