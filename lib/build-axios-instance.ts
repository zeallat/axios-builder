import {
  Axios,
  AxiosRequestConfig,
} from 'axios';
import _ from 'lodash';
import curlirize from 'axios-curlirize';
import { requestLoggingIntercepter } from './request-logging-intercepter';
import { responseLoggingIntercepter } from './response-logging-intercepter';
import { errorLoggingInterceptor } from './error-logging-interceptor';

interface Params {
    axiosRequestConfig?: AxiosRequestConfig;
    loggingEnabled?: boolean; // 로깅 활성화 여부
}

const DEFAULT_TIME_OUT_IN_MILLIS = 30 * 1000;

const DEFAULT_PARAMS: Params = {
  axiosRequestConfig: {
    timeout: DEFAULT_TIME_OUT_IN_MILLIS,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  loggingEnabled: true,
};

export const buildAxiosInstance = (params: Params = DEFAULT_PARAMS) => {
  const { axiosRequestConfig, loggingEnabled } = <Params>(_.defaultsDeep(params, DEFAULT_PARAMS));
  const instance = new Axios(axiosRequestConfig);

  // Logging 설정
  if (loggingEnabled) {
    // @ts-ignore
    curlirize(instance);
    instance.interceptors.request.use(
      requestLoggingIntercepter,
      errorLoggingInterceptor,
    );
    instance.interceptors.response.use(
      responseLoggingIntercepter,
      errorLoggingInterceptor,
    );
  }

  return instance;
};
