import Logs from '../model/logsModel.js';

const createLog = async(role, id, type, detail) => {
  const time = new Date();
  await Logs.create({by : role, s_id : id, type, time, detail});
};

export default createLog;