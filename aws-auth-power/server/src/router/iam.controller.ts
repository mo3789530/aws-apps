import express from 'express';
import { IamService } from '../service/iam.service'
import { Logger } from '../utils/logger';

const router = express.Router();
const logger = new Logger();
const service: IamService = new IamService();
const file = { 'class': 'iam.controller' };

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello' });
});

router.get('/groups', async (req, res) => {
  logger.info('list group', file)
  try {
    const groups = await service.listGroup();
    return res.status(200).json({ "groups": groups });
  } catch (err) {
    return res.status(400).json({ error: err })
  }

});

router.post('/group', async (req, res) => {
  logger.info('create group', file);
  const groupname = req.body.groupname;

  try {
    await service.createIamUserGroup(groupname);
    return res.status(200).json({});
  } catch (err) {
    return res.status(400).json({ error: err });
  }

});


router.post('/group/:id', async (req, res) => {
  logger.info('create group', file);
  const groupname = req.body.groupname;
  const username = req.body.username;

  try {
    const group = await service.findGroup(groupname);
    if (group?.groupName !== groupname && req.params.id !== group?.groupId) {
      return res.status(404).json({ "error": "Not Found group" });
    }
    const findUser = await service.findUser(username);
    if (findUser?.userName !== username) {
      return res.status(404).json({ "error": "Not Found user" });
    }

    await service.addUserToGroup(groupname, username);
    return res.status(200).json({});

  } catch (err) {
    return res.status(400).json({ error: err });
  }

});

// create new iam user
router.post('/user', async (req, res) => {
  logger.info('create new user', file)
  try {
    const user = req.body.username;
    await service.createIamUser(user);
    return res.status(200).json();
  } catch (err) {
    return res.json(400).json({ error: err })
  }
});

router.delete('/group', async (req, res) => {
  logger.info('delete user ', file)
  try {
    const groupname = req.body.groupname;
    const username = req.body.username;

    await service.removeUserFromGroup(groupname, username);
  } catch (err) {
    return res.json(400).json({ error: err })
  }

})

export default router;