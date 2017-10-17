import R from 'ramda';
import webPush from 'web-push';

module.exports = app => {
  const config = R.path(["libs", "config", "push"], app);
  webPush.setVapidDetails(
    config.owner,
    config.publicKey,
    process.env.PUSH_PRVKEY || config.privateKey
  );
};
