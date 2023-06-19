import { KafkaMiddleware } from './kafka.middleware';

describe('KafkaMiddleware', () => {
  it('should be defined', () => {
    expect(new KafkaMiddleware()).toBeDefined();
  });
});
