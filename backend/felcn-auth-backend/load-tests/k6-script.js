import http from 'k6/http';
import { check } from 'k6';

export let options = {
  tags: { project: __ENV.PROYECTO || 'DefaultProjectName' },
  stages: [
    {
      duration: __ENV.K6_STAGE1_DURATION || '10s',
      target: __ENV.K6_STAGE1_USERS || 1,
    },
    {
      duration: __ENV.K6_STAGE2_DURATION || '10s',
      target: __ENV.K6_STAGE2_USERS || 2,
    },
    {
      duration: __ENV.K6_STAGE3_DURATION || '10s',
      target: __ENV.K6_STAGE3_USERS || 0,
    },
  ],
};

export default function () {
  const url = __ENV.URL_BASE || 'https://base.dev.agetic.gob.bo/ws';

  const res = http.get(`${url}/api/health.services`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}