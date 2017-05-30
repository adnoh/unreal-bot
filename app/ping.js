function pingPong(content) {
  if (content === 'ping') {
    return 'pong'
  } else {
    return 'ERROR'
  }
}

module.exports = pingPong
