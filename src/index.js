import dotenv from 'dotenv'
dotenv.config({ path: '.env.sample' });

import express from 'express'
import DBUtil from './DBUtil.js'
import RobloxUtil from './rbx/RobloxUtils.js'
import cors from 'cors'

const app = express();

app.options('*', cors())

app.use(express.static('web/'))

app.get('/create', async (req, res) => {
    const captcha = req.query.captcha;
    const captchaId = req.query.captchaId;
    const account = await RobloxUtil.createAccount(captcha, captchaId);

    if (account != null) {
        await DBUtil.addAccount(account.userId, account.username, account.password, account.cookie);
        res.send('UserId: ' + account.userId);
    }

    res.send('UserId: failed');
});

app.get('/gen', async (_, res) => {
    const account = await DBUtil.getRandomAccount();

    res.send(account.cookie);
})

app.get('/field_data', async (_, res) => {
    res.send(await RobloxUtil.getFieldData());
});

(async () => {
    if (!(await DBUtil.connect())) return;
    await DBUtil.setupDB();

    app.listen(process.env.WEB_PORT, () => {
        console.log('[✅] Listening on port http://localhost:' + process.env.WEB_PORT);
    });
})();