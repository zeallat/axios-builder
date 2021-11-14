import { AxiosError } from 'axios';

export const isAxiosError = (value: any): value is AxiosError => value?.isAxiosError;
