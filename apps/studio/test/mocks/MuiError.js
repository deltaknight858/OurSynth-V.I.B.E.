// Mock for @mui/utils/macros/MuiError.macro
module.exports = function MuiError(message) {
  const error = new Error(message);
  error.name = 'MuiError';
  return error;
};

module.exports.default = module.exports;
