import express from 'express';
import { wrapAsync } from '@utils/express-async-wrapper';
import { CPULoad } from '@monitoring/api-client';
import { getAverageCpuLoad } from '@services/cpu/cpu.service';

export const cpuRouter = express.Router();

cpuRouter.get(
  '/load',
  wrapAsync(async (req, res) => {
    // Prepare the response
    const out: CPULoad = {
      time: new Date().toISOString(),
      average: getAverageCpuLoad()
    };

    // Send the response
    res.send(out);
  })
);
