import { Handler, Context, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

interface Response {
    statusCode: number;
    body: string;
}

const kafka = new Kafka({
    brokers: process.env.BROKERS?.split(',') || [],
});

const producer = kafka.producer();

export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback): Promise<Response> => {

    const pathParameters = event.pathParameters;
    const correlationId: string = event.headers['X-Correlation-ID'] || uuid();
    const origin: string = event.headers['X-Origin'] || '';
    const topic: string = pathParameters?.topic || 'default-topic';
    await producer.connect();
    await producer.send({
        topic,
        messages: [
            { value: event.body, headers: { 'X-Correlation-ID': correlationId, 'X-Origin' : origin} },
        ],
    });

    return Promise.resolve({
        statusCode: 202,
        body: JSON.stringify({
          "status": "Accepted"
        }),
      });
};
