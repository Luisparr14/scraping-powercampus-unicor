const cron = require('node-cron');
const { chromium } = require('playwright');
const { main } = require('./nodemailer');
require('dotenv').config();
// (*/10 * * * * *) Revisa cada 10 segundos
cron.schedule('*/10 * * * * *', async () => {
  try {
    console.log('REVISANDO POWER CAMPUS...', new Date().toLocaleTimeString());
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://powercampus.unicordoba.edu.co/Home.aspx');
    await page.type('#ctl00_ucUserLogin_lvLoginUser_ucLoginUser_lcLoginUser_UserName', process.env.USER_POWERCAMPUS);
    await page.type('#ctl00_ucUserLogin_lvLoginUser_ucLoginUser_lcLoginUser_Password', process.env.PASS_POWERCAMPUS);
    await page.press('#ctl00_ucUserLogin_lvLoginUser_ucLoginUser_lcLoginUser_LoginButton', 'Enter');
    await page.goto('http://powercampus.unicordoba.edu.co/Registration/Registration.aspx')
    await page.screenshot({
      path: 'images/capturaPagina.png',
    });
    const content = await page.content();
    const canEnroll = !(content.includes('En este momento no puede inscribirse.'))
    if (canEnroll) {
      console.log('YA HAY CUPOS!!!');
      await main().catch(console.error);
    } else {
      console.log('No se puede inscribir aun');
    }
    await browser.close();
  } catch (error) {
    console.error('ERROR', error);
    await browser.close();
  }
});