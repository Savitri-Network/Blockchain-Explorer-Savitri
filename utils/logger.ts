import ServerURL from '@/app/api/serverUrl';
import axios, { AxiosError } from 'axios';
import { LogLevel } from './logLevel';

// Logger function
 interface LogEntry {
  type: string;
  userId: number | string;
  source: string;
  data: string;
  ipAddress: string;
  sessionPropertyNames: string[];
  allPropertyNames: string[];
  permanentPropertyNames: string[];
  sessionProperties: Record<string, string>;
  permanentProperties: Record<string, string>;
  processIdKey: string;
}

export async function logMessage(
  level: LogLevel,
  type: string,
  data: unknown,
  userId: number | string,
  source: string
): Promise<void> {
  let messageData: unknown = null;

  if (data instanceof AxiosError) {
    messageData = { url: data.config?.url, data: data.response?.data };
  } else {
    messageData = data;
  }
  const message: LogEntry = {
    data: JSON.stringify(messageData),
    type: type,
    userId: userId,
    source: source,
    ipAddress: '',
    sessionPropertyNames: [],
    allPropertyNames: [],
    permanentPropertyNames: [],
    sessionProperties: {},
    permanentProperties: {},
    processIdKey: '',
  };
  try {
    const response = await axios.post(ServerURL() + `/api/v1/logging/${level}`, message);
    if (response.status !== 200) {
      console.error('Log message failed', response.status);
    }
  } catch (error) {
    console.error('Error sending log message', error);
  }
}