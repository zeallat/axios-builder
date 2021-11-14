// Error 로깅 인터셉터
import { responseLoggingIntercepter } from './response-logging-intercepter';
import { isAxiosError } from './is-axios-error';

export const errorLoggingInterceptor = (error: any) => {
  // Axios 오류일 경우 리스폰스 로깅 인터셉터에게 위임합니다.
  if (isAxiosError(error) && error.response) {
    // eslint-disable-next-line no-param-reassign
    error.response = responseLoggingIntercepter(error.response);
  }
  throw error;
};
