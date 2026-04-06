const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log('LIVE LOG:', msg.type(), msg.text());
    });
    page.on('pageerror', error => console.error('LIVE EXCEPTION:', error.message));

    console.log('Navigating to live pay page...');
    await page.goto('https://quran.alsababah.com/pay/?uid=naFZOaFSQrM64vtUIee3Bbfqe4R2&email=oooomar000000%40gmail.com&name=%D8%B9%D9%85%D8%B1+%D8%AD%D9%85%D9%8A%D8%AF+%D8%A7%D9%84%D8%B9%D8%AF%D9%8I%D9%86%D9%8A&plan=annual-pro', { waitUntil: 'networkidle2', timeout: 60000 });
    
    await browser.close();
  } catch (err) {
    console.error("Puppeteer Script Error:", err);
  }
})();
