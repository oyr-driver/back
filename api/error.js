function buildErrorDto(status, err) {
  return {
    status,
    message: err.message,
    name: err.name,
  };
}
exports.buildErrorDto = buildErrorDto;

exports.NaverMessageSendError = class NaverMessageSendError extends Error {
  constructor(message) {
    super(message);
    this.name = "NaverMessageSendError";
  }

  toDto(status) {
    return buildErrorDto(status, this);
  }
};
