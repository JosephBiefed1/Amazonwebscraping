const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.amazon.sg/s?k=amazon+basic&crid=3F60HBUUCWFFD&sprefix=amazon+basi%2Caps%2C397&ref=nb_sb_noss_2', {
        waitUntil: 'load'
    });

    const is_disabled = await page.$('span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator') != null;
    console.log(is_disabled)




})()