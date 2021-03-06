var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  if (err) {
    console.log('err: ', err);
  }
  conn.createChannel((err, ch) => {
    var queue = 'first-queue';
    var message = {
      type: '2',
      queue: 'Hello world',
    };
    var exchange = 'first-exchange';
    var key = 'red';

    ch.assertExchange(exchange, 'direct', { durable: false });
    ch.assertQueue(queue, { durable: false });
    ch.publish(exchange, key, Buffer.from(JSON.stringify(message)));
    console.log('Message was sent');
  });

  setTimeout(() => {
    conn.close;
    process.exit();
  }, 500);
});
