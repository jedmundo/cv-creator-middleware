const onError = (port: number | string): (error: NodeJS.ErrnoException) => void => {
  return (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    let bind;

    if (typeof port === 'string') {
      bind = `Pipe ${port}`;
    } else {
      bind = `Port ${port}`;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        break;
      default:
        console.error(error.message);
    }

    throw error;
  };
};

export default onError;
