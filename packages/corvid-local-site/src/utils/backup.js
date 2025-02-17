const fs = require("fs-extra");
const logger = require("corvid-local-logger");
const { getMessage } = require("../messages");

const backup = async (siteSrcPath, backupPath) => {
  logger.info(getMessage("Backup_Start_log"));
  try {
    await fs.emptyDir(backupPath);
    await fs.copy(siteSrcPath, backupPath);
    logger.info(getMessage("Backup_Complete_log"));
  } catch (e) {
    logger.info(getMessage("Backup_Fail_log"));
    await deleteBackup();
    throw e;
  }
};
const deleteBackup = async backupPath => {
  logger.info(getMessage("Backup_Delete_Start_log"));
  await fs.remove(backupPath);
  logger.info(getMessage("Backup_Delete_Complete_log"));
};
const restore = async (siteSrcPath, backupPath) => {
  logger.info(getMessage("Backup_Restore_Start_log"));
  await fs.emptyDir(siteSrcPath);
  await fs.move(backupPath, siteSrcPath, { overwrite: true });
  logger.info(getMessage("Backup_Restore_Complete_log"));
};

const withBackupInit = (siteSrcPath, backupPath, filesWatcher) => {
  return asyncCallback => async (...args) => {
    await backup(siteSrcPath, backupPath);
    try {
      const result = await asyncCallback(...args);
      await deleteBackup(backupPath);
      return result;
    } catch (error) {
      filesWatcher.pause();
      await restore(siteSrcPath, backupPath);
      filesWatcher.resume();
      throw error;
    }
  };
};
module.exports = withBackupInit;
