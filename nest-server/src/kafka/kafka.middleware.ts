import { Injectable, NestMiddleware } from '@nestjs/common';
import { Producer, Kafka } from 'kafkajs';
import { Request, Response, NextFunction } from 'express';
// import * as dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class KafkaMiddleware implements NestMiddleware {
  kafka: Kafka;
  producer: Producer;
  constructor() {
    console.log('kafkabroker: ', process.env.KAFKA_BROKERS);
    this.kafka = new Kafka({
      clientId: 'nest-log-producer',
      brokers: [process.env.KAFKA_BROKERS],
    });
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    });
    this.connect();
  }
  async connect() {
    try {
      await this.producer.connect();
    } catch (e) {
      // console.log(e);
    }
  }
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('request: \n', req.ip);
    const topic = 'access-log';
    const userAgent = req.headers['user-agent'] || '';
    const os = userAgent.split(/[()]/)[1] || 'Unknown'; // Extract operating system info from user-agent header
    const device = userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone)/)
      ? 'Mobile'
      : 'Desktop'; // Detect device type based on user-agent header
    const browser = userAgent.split(/[()]/)[2]?.split(' ')[1] || 'Unknown'; // Extract browser info from user-agent header
    const message = {
      key: 'nest-log-ip',
      value: JSON.stringify({
        ip: req.ip,
        os: os,
        device: device,
        browser: browser,
      }),
    };
    const messages = Array(1).fill(message);
    try {
      await this.producer
        .send({
          topic,
          messages: messages,
        })
        .then(console.log);
    } catch (e) {
      // console.log('[error]', e);
    }
    next();
  }

  async logUserLogin(name: string, email: string, req: Request) {
    const topic = 'user-logins';
    const userAgent = req.headers['user-agent'] || '';
    const os = userAgent.split(/[()]/)[1] || 'Unknown'; // Extract operating system info from user-agent header
    const device = userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone)/)
      ? 'Mobile'
      : 'Desktop'; // Detect device type based on user-agent header
    const browser = userAgent.split(/[()]/)[2]?.split(' ')[1] || 'Unknown'; // Extract browser info from user-agent header
    const message = {
      key: 'user-login',
      value: JSON.stringify({
        name: name,
        email: email,
        ip: req.ip,
        os: os,
        device: device,
        browser: browser,
        time: new Date().toISOString(),
      }),
    };
    const messages = Array(1).fill(message);
    try {
      await this.producer
        .send({
          topic,
          messages: messages,
        })
        .then(console.log);
    } catch (e) {
      // console.log('[error]', e);
    }
  }
}
