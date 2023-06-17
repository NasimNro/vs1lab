let id = 0;
function generateId() {
  return id++ + "";
}

module.exports = generateId;
