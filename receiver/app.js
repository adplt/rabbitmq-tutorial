var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);
console.log('args: ', args);

function start() {
  try {
    amqp.connect('amqp://localhost?heartbeat=10', function(err, conn) {
      if (err) {
        console.error('[AMQP]', err.message);
        return setTimeout(start, 1000);
      }
      conn.createChannel((err, ch) => {
        if (err) {
          console.error('[AMQP]', err.message);
          return setTimeout(start, 1000);
        }
        conn.on('close', function() {
          console.error('[AMQP] reconnecting');
          return setTimeout(start, 1000);
        });
        var queue = 'first-queue';
        var exchange = 'first-exchange';
        var keys = ['red'];

        ch.assertExchange(exchange, 'direct', { durable: false });
        ch.assertQueue(queue, { durable: false });
        console.log('waiting for message in: ', queue);
        for (let i = 0, { length } = keys; i < length; i++) {
          ch.bindQueue(queue, exchange, keys[i]);
        }
        ch.consume(queue, (message) => {
          console.log('Received: ', message.fields.routingKey, message.content.toString());
        }, { noAck: true });
      });
    });
  } catch(error) {
    console.error('[AMQP]', error.message);
    return setTimeout(start, 1000);
  }
}

try {
  start();
} catch (error) {
  throw error;
}
